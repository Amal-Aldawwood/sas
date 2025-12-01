# Client Management Guide

This guide explains how to add and edit clients (tenants) in your multi-tenant SaaS application.

## Adding a New Client

There are two ways to add a new client to your application:

### Method 1: Using the Admin Dashboard (Recommended)

1. **Access the Admin Dashboard:**
   - Go to http://localhost:3000/admin/dashboard
   - You'll see a list of existing clients and an "Add New Client" button

2. **Fill in the Client Details:**
   - Click the "Add New Client" button
   - Complete the form with the following details:
     - **Company Name:** The name of the client organization
     - **Subdomain:** A unique identifier used in the URL (e.g., "acme" becomes "acme.yourapp.com")
     - **Primary Color:** The main brand color for this client
     - **Secondary Color:** A complementary brand color
     - **Logo URL:** An optional URL to the client's logo
     - **Admin Account Details:** Name, email, and password for the client's admin user

3. **Submit the Form:**
   - Click "Create" to add the new client
   - You'll be redirected to the dashboard where you can see the newly added client

### Method 2: Using API Endpoints Directly

If you prefer to add clients programmatically:

```javascript
// Example: Creating a new tenant via API
fetch('/api/admin/tenants', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Acme Corporation',
    subdomain: 'acme',
    primaryColor: '#FF5733',
    secondaryColor: '#33FF57',
    logoUrl: 'https://example.com/logo.png',
    adminName: 'John Admin',
    adminEmail: 'admin@acme.com',
    adminPassword: 'securePassword123'
  }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## Editing an Existing Client

### Method 1: Using the Admin Dashboard (Recommended)

1. **Access the Admin Dashboard:**
   - Go to http://localhost:3000/admin/dashboard
   - You'll see a list of all clients

2. **Select the Client to Edit:**
   - Find the client you want to modify
   - Click the "Edit" button next to that client

3. **Update Client Details:**
   - Modify any of the following details:
     - Company Name
     - Subdomain
     - Primary Color
     - Secondary Color
     - Logo URL

4. **Save Changes:**
   - Click "Update Client" to save your changes
   - You'll be redirected to the dashboard where you can see the updated client

### Method 2: Using API Endpoints Directly

For programmatic updates:

```javascript
// Example: Updating a tenant via API
fetch('/api/admin/tenants/1', {  // Replace '1' with the actual tenant ID
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Acme Corp Updated',
    subdomain: 'acme',
    primaryColor: '#FF5733',
    secondaryColor: '#33FF57',
    logoUrl: 'https://example.com/new-logo.png'
  }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## Accessing Client Sites

After adding or editing a client, you can access their branded site in two ways:

### With Subdomain Configuration (Production)

In a production environment with proper DNS setup:
- Admin site: http://admin.yourapp.com
- Client sites: http://[client-subdomain].yourapp.com

### Without Subdomain Configuration (Development)

During local development:
- Admin site: http://localhost:3000/admin/dashboard
- Client sites: http://localhost:3000/tenant/[client-subdomain]/dashboard

## Important Notes

1. **Subdomain Uniqueness:** Each client must have a unique subdomain.

2. **In-Memory Database:** Since this application uses a mock database (in-memory), changes will be lost when the server restarts. In a production application, you would use a persistent database.

3. **Client Data Isolation:** Each client can only access their own data, ensuring proper multi-tenancy.

4. **Admin Credentials:** When creating a new client, you're also creating the initial admin account for that client. Share these credentials securely with the client administrator.
