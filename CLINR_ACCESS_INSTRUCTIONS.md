# How to Access Clinr Client

This document provides instructions on how to access the Clinr client in this multi-tenant SaaS application.

## Method 1: Direct Access Link

We've added a direct access link to the homepage. From the admin dashboard, click on the "Clinr Direct Access" button.

This will redirect you to the Clinr dashboard. If you're prompted to log in, use the following credentials:

- **Email:** admin@clinr.com
- **Password:** password123

## Method 2: Admin Dashboard

1. Log in to the admin dashboard using:
   - **Email:** admin@yourapp.com
   - **Password:** your-secure-password

2. From the admin dashboard, you'll see a list of all clients including Clinr.

3. Click the "Visit" button next to Clinr.

## Method 3: Direct URL

You can directly access the Clinr dashboard using the URL structure:

- For local development: `http://localhost:3000/clinr/dashboard`
- In production: `http://clinr.yourapp.com/dashboard`

## Troubleshooting

If you encounter any issues accessing the Clinr client, try these steps:

1. Make sure you're logged out of any other tenant or admin sessions first
2. Clear your browser cookies and cache
3. Try using the direct access page we created at `/direct-access-clinr`
4. Check that the development server is running with `npm run dev`

## Technical Details

The Clinr client has been added to the mock data with the following details:

```typescript
{
  id: '3',
  name: 'Clinr',
  subdomain: 'clinr',
  logoUrl: null,
  primaryColor: '#ff6b00',
  secondaryColor: '#0066ff',
  createdAt: new Date(),
  updatedAt: new Date()
}
```

And a corresponding admin user:

```typescript
{
  id: '4',
  name: 'Clinr Admin',
  email: 'admin@clinr.com',
  password: 'password123',
  role: 'ADMIN',
  tenantId: '3',  // Belongs to Clinr
  createdAt: new Date(),
  updatedAt: new Date()
}
