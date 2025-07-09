# Lista Deportiva - Sports App with Keycloak Authentication

This is a [Next.js](https://nextjs.org) project with Keycloak authentication and admin functionality for viewing encrypted reservations.

## Features

- **Authentication**: Keycloak integration with NextAuth.js
- **Sports Display**: Shows most played sports globally
- **Admin Panel**: Secure access to encrypted reservation data
- **Azure Key Vault**: Decryption of reservation data using Azure Key Vault

## Admin Functionality

Users with the `admin` role can view a list of reservations fetched from an encrypted API endpoint. The data is decrypted using Azure Key Vault with RSA-OAEP and AES-GCM encryption.

## Environment Setup

Copy `.env.example` to `.env.local` and configure the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Keycloak Configuration
KEYCLOAK_CLIENT_ID=your-keycloak-client-id
KEYCLOAK_CLIENT_SECRET=your-keycloak-client-secret
KEYCLOAK_ISSUER=https://your-keycloak-domain/realms/your-realm

# Azure Key Vault Configuration
AZURE_KEY_VAULT_URL=https://your-keyvault-name.vault.azure.net/
AZURE_KEY_NAME=your-rsa-key-name
```

For Azure authentication, you can use:
1. Azure CLI: Run `az login`
2. Environment variables for service principal
3. Managed Identity (when deployed to Azure)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure your environment variables in `.env.local`

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
