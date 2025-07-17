# Keycloak Integration Guide

This guide explains how to set up and configure Keycloak as an authentication provider for the Moesif Developer Portal.

## Overview

The Moesif Developer Portal now supports three authentication providers:
- **Auth0** (existing)
- **Okta** (existing)
- **Keycloak** (new)

## Prerequisites

1. A running Keycloak server (version 23.0.0 or later recommended)
2. Admin access to the Keycloak server
3. A configured realm and client in Keycloak

## Keycloak Server Setup

### 1. Create a Realm

1. Log into your Keycloak Admin Console
2. Create a new realm (e.g., `moesif-portal`)
3. Configure realm settings as needed

### 2. Create a Client

1. In your realm, go to **Clients** → **Create Client**
2. Configure the client:
   - **Client ID**: `moesif-developer-portal`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `public` (for frontend SPA)
   - **Valid Redirect URIs**: `http://localhost:3000/*` (adjust for your domain)
   - **Web Origins**: `http://localhost:3000` (adjust for your domain)

### 3. Configure Client Settings

1. Enable the following:
   - Standard Flow Enabled: `ON`
   - Direct Access Grants Enabled: `ON`
   - Implicit Flow Enabled: `ON` (for SPA)
2. Set **Valid Redirect URIs** to include your application URLs
3. Set **Web Origins** to your application domain

### 4. Create Client Scopes (Optional)

Configure custom scopes if needed for your application requirements.

## Frontend Configuration

### 1. Environment Variables

Create a `.env` file in `/my-dev-portal/` with the following variables:

```bash
# Copy from .env.keycloak.template
REACT_APP_AUTH_PROVIDER=Keycloak
REACT_APP_KEYCLOAK_URL=https://your-keycloak-server.com
REACT_APP_KEYCLOAK_REALM=your-realm-name
REACT_APP_KEYCLOAK_CLIENT_ID=your-client-id

# Other required variables
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_MOESIF_APPLICATION_ID=your_moesif_application_id
```

### 2. Install Dependencies

The required dependencies are already added to `package.json`:

```bash
npm install
```

Dependencies added:
- `keycloak-js`: ^23.0.0
- `@react-keycloak/web`: ^3.4.0

## Backend Configuration

### 1. Environment Variables

Create a `.env` file in `/my-dev-portal-api/` with the following variables:

```bash
# Copy from .env.keycloak.template
AUTH_PROVIDER=Keycloak
KEYCLOAK_URL=https://your-keycloak-server.com
KEYCLOAK_REALM=your-realm-name
KEYCLOAK_CLIENT_ID=your-client-id

# Admin credentials for user registration
KEYCLOAK_ADMIN_USERNAME=admin
KEYCLOAK_ADMIN_PASSWORD=admin-password

# Other required variables
MOESIF_APPLICATION_ID=your_moesif_application_id
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_ENDPOINT_SECRET=your_stripe_webhook_secret
```

### 2. Install Dependencies

The required dependencies are already added to `package.json`:

```bash
npm install
```

Dependencies added:
- `keycloak-admin`: ^1.14.22

## Key Features Implemented

### Frontend Components

1. **KeycloakProviderWithNavigate**: Wraps the app with Keycloak authentication
2. **KeycloakSecureRoute**: Protects routes requiring authentication
3. **KeycloakError**: Handles authentication errors
4. **KeycloakLogin**: Manages login flow
5. **useAuthCombined**: Unified hook supporting all three providers

### Backend Services

1. **authPlugin.js**: JWT token validation for Keycloak tokens
2. **keycloakApis.js**: User management via Keycloak Admin API
3. **Registration endpoint**: `/keycloak/register` for new user signup

### Authentication Flow

1. **Login**: User is redirected to Keycloak login page
2. **Token Validation**: Backend validates JWT tokens from Keycloak
3. **User Registration**: New users can sign up via `/keycloak/register` endpoint
4. **Route Protection**: Protected routes require valid Keycloak authentication

## API Endpoints

### POST /keycloak/register

Creates a new user in Keycloak.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User created successfully in Keycloak",
  "user": {
    "id": "user-uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Security Considerations

1. **JWT Validation**: All API endpoints validate JWT tokens using Keycloak's public keys
2. **JWKS Endpoint**: Automatically fetches signing keys from Keycloak
3. **Token Refresh**: Handled automatically by the Keycloak client
4. **Admin Credentials**: Store admin credentials securely (consider using service accounts)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Web Origins are configured correctly in Keycloak client
2. **Redirect URI Mismatch**: Verify Valid Redirect URIs match your application URLs
3. **Token Validation Errors**: Check that KEYCLOAK_URL and KEYCLOAK_REALM are correct
4. **Admin API Errors**: Verify admin credentials and permissions

### Debug Steps

1. Check browser console for authentication errors
2. Verify environment variables are loaded correctly
3. Test Keycloak endpoints directly (/.well-known/openid_configuration)
4. Check backend logs for JWT validation errors

## Migration from Auth0/Okta

To migrate from Auth0 or Okta to Keycloak:

1. Export users from your current provider
2. Import users into Keycloak (or use federation)
3. Update environment variables
4. Test authentication flow
5. Update DNS/load balancer configuration if needed

## Testing

### Frontend Testing

```bash
cd my-dev-portal
npm start
```

Navigate to `http://localhost:3000` and test:
- Login flow
- Protected routes
- User registration
- Logout flow

### Backend Testing

```bash
cd my-dev-portal-api
npm start
```

Test API endpoints:
- JWT token validation
- User registration endpoint
- Protected API routes

## Support

For issues specific to Keycloak integration:
1. Check Keycloak server logs
2. Verify client configuration
3. Test with Keycloak's built-in account console
4. Review JWT token claims and structure

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak Admin REST API](https://www.keycloak.org/docs-api/latest/rest-api/)
- [React Keycloak Integration](https://github.com/react-keycloak/react-keycloak)
