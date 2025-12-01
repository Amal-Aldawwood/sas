# Multi-Tenant SaaS Application

This project demonstrates a multi-tenant SaaS (Software as a Service) application that serves multiple clients through custom subdomains. Each client has their own personalized experience with custom branding, isolated data, and user management.

## Key Features

- **Custom Subdomains**: Each client accesses the platform through their own subdomain (e.g., `client1.yourapp.com`, `client2.yourapp.com`)
- **Branded Experience**: Custom logos, colors, and styles per tenant
- **Isolated Data**: Tenant data is completely separate from other tenants
- **Role-Based Access**: Super Admin, Client Admin, and Client User roles
- **Centralized Management**: Super Admin can add and manage clients from a central dashboard

## Project Structure

```
/app
  /(admin)                  # Super Admin routes
    /dashboard              # Admin dashboard
    /tenants                # Tenant management
      /create               # Create new tenant form
  
  /(customer)               # Client-specific routes
    /[tenant]               # Dynamic tenant routes
      /dashboard            # Tenant dashboard
      /login                # Tenant login page
      
  /api                      # API routes
    /admin                  # Admin API endpoints
      /auth                 # Authentication
      /tenants              # Tenant management
    
    /[tenant]               # Tenant-specific API endpoints
      /auth                 # Authentication
      /data                 # Tenant data
      
/lib                        # Shared utilities
  /prisma.ts                # Database client
  /auth-context.tsx         # Authentication context
  
/prisma                     # Database schema
  /schema.prisma            # Prisma schema
  
/middleware.ts              # Next.js middleware for subdomain routing
```

## Database Schema

The application uses a multi-tenant database design with three main models:

1. **Tenant**: Stores client organization details
   - `id`, `name`, `subdomain`, `logoUrl`, `primaryColor`, `secondaryColor`

2. **User**: User accounts linked to tenants
   - `id`, `name`, `email`, `password`, `role`, `tenantId`

3. **Data**: Tenant-specific data
   - `id`, `content`, `tenantId`, `createdAt`

## User Journey

### Super Admin
1. Log in at `admin.yourapp.com`
2. View all tenants on the dashboard
3. Add new tenants with custom branding
4. Monitor tenant usage

### Tenant Admin
1. Receive login credentials
2. Access custom-branded dashboard at `[tenant].yourapp.com`
3. Manage tenant users and data

### Tenant User
1. Log in at `[tenant].yourapp.com`
2. Access only their company's data
3. Use the application with their company's branding

## Deployment Instructions

### 1. DNS Configuration

Set up wildcard DNS to handle subdomains:

```
*.yourapp.com  →  [Your server IP or hosting provider]
```

For specific subdomains:

```
admin.yourapp.com  →  [Your server IP or hosting provider]
client1.yourapp.com  →  [Your server IP or hosting provider]
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Set the database URL in your `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase
```

3. Run database migrations:

```
npx prisma migrate dev
```

### 3. Environment Variables

Create a `.env` file with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/mydatabase

# Next.js
NEXT_PUBLIC_APP_URL=yourapp.com

# Security
JWT_SECRET=your-secret-key-here
```

### 4. Deploy to Production

1. Build the application:

```
npm run build
```

2. Start the server:

```
npm start
```

For production deployments, consider using a platform like Vercel, AWS, or Google Cloud.

## Security Considerations

1. **Data Isolation**: The application implements row-level security to ensure tenant data is isolated
2. **Authentication**: JWT-based authentication with secure HTTP-only cookies
3. **Input Validation**: All user inputs are validated on both client and server
4. **CORS Policy**: Proper CORS policies for API routes

## Business Model

The application supports various pricing models:

1. **Per Tenant**: Fixed monthly fee per client organization
2. **Per User**: Monthly fee based on the number of users
3. **Tiered Plans**: Basic, Professional, and Enterprise with different feature sets

## Development

1. Clone the repository
2. Install dependencies:

```
npm install
```

3. Set up the database:

```
npx prisma generate
npx prisma db push
```

4. Run the development server:

```
npm run dev
```

5. Access the application:
   - Admin: http://localhost:3000/admin
   - Tenant: To test tenant-specific functionality, you'll need to modify your hosts file to point subdomains to localhost, or use tools like ngrok for local subdomain testing.

## License

MIT
# sas
