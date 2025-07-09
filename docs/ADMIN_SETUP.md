# Admin Reservation Management Setup Guide

## Overview
This guide explains how to set up and use the admin functionality for viewing encrypted reservations in the Lista Deportiva application.

## Features Added

### 1. Admin Role Detection
- Users with the `admin` role in Keycloak can access the reservation management panel
- Role-based access control is implemented both on the frontend and backend

### 2. Encrypted API Integration
- Fetches reservation data from `https://desseg-canchas.chuvblocks.com/api/reservas`
- Handles encrypted response with RSA-OAEP and AES-GCM decryption
- Uses Azure Key Vault for secure key management

### 3. User Interface
- Clean, responsive table displaying reservation information
- Loading states and error handling
- Automatic refresh functionality
- Status-based color coding for reservations

## Setup Instructions

### 1. Environment Configuration
Create a `.env.local` file with the following variables:

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

### 2. Azure Key Vault Setup
1. Create an Azure Key Vault
2. Generate or import an RSA key for decryption
3. Configure authentication using one of:
   - Azure CLI: Run `az login`
   - Service Principal with environment variables
   - Managed Identity (for Azure deployments)

### 3. Keycloak Configuration
1. Ensure users have the `admin` role assigned in Keycloak
2. The role should be included in the `realm_access.roles` claim of the JWT token

## API Endpoints

### `/api/reservations`
- **Method**: GET
- **Authentication**: Required (NextAuth session)
- **Authorization**: Admin role required
- **Response**: Decrypted array of reservation objects

#### Reservation Object Structure
```typescript
{
  _id: string;
  email: string;
  date: string; // ISO date string
  cancha_id: string;
  state: 'ACCEPTED' | 'PENDING' | 'REJECTED';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
```

## Security Features

### 1. Authentication & Authorization
- Session-based authentication with NextAuth
- Role-based access control
- API endpoint protection

### 2. Encryption Handling
- RSA-OAEP decryption for AES key
- AES-256-GCM decryption for reservation data
- Secure key management with Azure Key Vault

### 3. Error Handling
- Graceful error handling for network issues
- User-friendly error messages
- Retry functionality for failed requests

## Usage

1. **Regular Users**: See the sports list and can authenticate
2. **Admin Users**: Additionally see:
   - Admin badge indicator
   - Reservation management panel
   - Real-time reservation data
   - Interactive table with sorting and filtering

## Troubleshooting

### Common Issues

1. **"Forbidden - Admin access required"**
   - Ensure the user has the `admin` role in Keycloak
   - Check that the role is included in the JWT token

2. **Azure Key Vault errors**
   - Verify the Key Vault URL and key name
   - Ensure proper authentication is configured
   - Check that the service principal has access to the Key Vault

3. **Decryption errors**
   - Verify the encryption format matches expectations
   - Check that the correct RSA key is being used
   - Ensure the API response structure is correct

### Debugging

Enable debugging by checking the browser console and server logs for detailed error messages. The API endpoint includes comprehensive error logging for troubleshooting encryption and authentication issues.

## Performance Considerations

- Reservations are fetched on demand when admin users load the page
- Table includes virtualization for large datasets
- Error states prevent unnecessary API calls
- Efficient re-render patterns with React state management

## Future Enhancements

Consider implementing:
- Pagination for large reservation lists
- Advanced filtering and search capabilities
- Export functionality for reservation data
- Real-time updates with WebSockets
- Reservation status management (approve/reject)
