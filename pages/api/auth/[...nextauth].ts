// nextauth.ts
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async jwt({ token, account, profile }) {
      // si es el primer login, copiamos los roles del id_token o access_token
      if (account?.access_token) {
        const decoded = JSON.parse(
          Buffer.from(account.access_token.split(".")[1], "base64").toString()
        );
        token.roles = decoded?.realm_access?.roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.roles = token.roles || [];
      return session;
    },
  },
});
