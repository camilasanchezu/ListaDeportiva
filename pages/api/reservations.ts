import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { DefaultAzureCredential } from '@azure/identity';
import { KeyClient, CryptographyClient } from '@azure/keyvault-keys';
import crypto from 'crypto';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { jwtDecode } from 'jwt-decode';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { Account } from 'next-auth';

const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.provider = account.provider;

        try {
          const payload = jwtDecode<{ realm_access?: { roles?: string[] } }>(account.access_token!);
          token.roles = payload?.realm_access?.roles || [];
        } catch {
          token.roles = [];
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      (session as Session & { accessToken?: string; roles?: string[] }).accessToken = token.accessToken as string;
      (session as Session & { accessToken?: string; roles?: string[] }).roles = token.roles as string[] || [];
      return session;
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const isAdmin = session?.roles?.includes('admin');
    if (!isAdmin) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    // Fetch encrypted data from the API
    const response = await fetch('https://desseg-canchas.chuvblocks.com/api/reservas');
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }

    const encryptedResponse = await response.json();
    const { encryptedData, encryptedAesKey, iv, authTag } = encryptedResponse;

    // Setup Azure Key Vault
    const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL;
    const keyName = process.env.AZURE_KEY_NAME;

    if (!keyVaultUrl || !keyName) {
      throw new Error('Azure Key Vault configuration missing');
    }

    const credential = new DefaultAzureCredential();
    const keyClient = new KeyClient(keyVaultUrl, credential);
    const key = await keyClient.getKey(keyName);
    
    if (!key.id) {
      throw new Error('Key ID not found');
    }
    
    const cryptoClient = new CryptographyClient(key.id, credential);

    // Decrypt the AES key using RSA
    const decryptResult = await cryptoClient.decrypt({
      algorithm: 'RSA-OAEP',
      ciphertext: Buffer.from(encryptedAesKey, 'base64')
    });
    const aesKey = decryptResult.result;

    // Decrypt the data with AES-GCM
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      aesKey,
      Buffer.from(iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(authTag, 'base64'));

    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    const reservations = JSON.parse(decrypted);

    return res.status(200).json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return res.status(500).json({ 
      message: 'Error fetching reservations', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
