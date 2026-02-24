# Data Persistence in the SAS Project

This document outlines the data persistence solution implemented in the project to ensure tenant data is saved between server restarts.

## Overview

The SAS project uses a hybrid approach for data management:

1. **In-Memory Storage**: Fast access to data during runtime
2. **File-Based Persistence**: JSON files for data persistence between server restarts
3. **API-based Storage**: Server-side API routes to handle file operations
4. **Mock Database Interface**: Interface that mimics a real database

This implementation provides the benefits of quick in-memory access while ensuring data isn't lost when the server restarts.

## Implementation Details

### File Structure

Data is stored in JSON files within a `data` directory at the project root:

```
/data/
  ├── tenants.json   # Contains all tenant data
  └── users.json     # Contains all user data
```

### Key Components

1. **`app/api/storage/route.ts`** - Server-side API for file operations:
   - Handles file system operations safely on the server
   - Creates, reads, and updates JSON files
   - Provides REST endpoints for data operations

2. **`lib/file-storage.ts`** - Client-safe storage operations:
   - Makes API calls to the storage API
   - Handles data conversion and formatting
   - Provides error handling
   
3. **`lib/mock-data.ts`** - Database interface layer:
   - Maintains in-memory data structures (mockTenants, mockUsers)
   - Provides database-like API (addTenant, findTenantBySubdomain, etc.)
   - Asynchronously integrates with file storage for persistence

4. **Application APIs** - Unchanged, using the mock-data interface:
   - Tenant management APIs
   - User authentication APIs

## How It Works

1. **Server Startup**:
   - The API route handler checks if data files exist when first accessed
   - If they don't exist, it creates them with empty structures
   - Mock data is initialized in memory and attempts to load saved data from disk
   
2. **Data Creation/Modification**:
   - Changes are made to the in-memory data structures synchronously
   - The updated data is asynchronously written to files via API calls
   - This ensures fast operations with eventual persistence

3. **Data Retrieval**:
   - Data is primarily read from in-memory structures for performance
   - If the server restarts, data is reloaded from JSON files via API calls

## Benefits

1. **Persistence Without Database Setup**: 
   - No need for PostgreSQL or other database setup
   - Simpler deployment in development environments
   
2. **Data Survives Server Restarts**:
   - New tenants and users are preserved
   - Configuration changes persist
   
3. **Simplified Development**:
   - Maintains the simple mock-data API
   - No need to change existing code

4. **Next.js Compatibility**:
   - File system operations confined to server components
   - Client-safe API for accessing the storage system
   - Works with Next.js's hybrid rendering model

## Limitations

1. **Not Suitable for Production**:
   - This solution is for development/testing only
   - Lacks transaction support, concurrent access control, etc.
   
2. **Single Server Only**:
   - Won't work in multi-server environments
   - No replication or sharing of data between instances

3. **Limited Data Volume**:
   - Best for small to medium datasets
   - Not optimized for large amounts of data

## Upgrading to a Real Database

When ready to upgrade to a real database:

1. Replace the implementation in `lib/prisma.ts` to use actual Prisma client operations
2. Remove the file-based storage mechanisms
3. Run proper database migrations

The application code using the data access layer should require minimal changes since the API interfaces remain the same.

## Using the System

You don't need to interact directly with the file storage system - just use the standard API functions in `mock-data.ts`:

```typescript
import { addTenant, findTenantBySubdomain } from '@/lib/mock-data';

// Create a new tenant - will be automatically persisted
const newTenant = addTenant({
  name: "New Company",
  subdomain: "newcompany",
  primaryColor: "#ff0000",
  secondaryColor: "#0000ff"
});

// Find a tenant - will use in-memory data, but data persists between restarts
const tenant = findTenantBySubdomain("newcompany");
```

The system handles all the persistence details behind the scenes, making API calls to the storage endpoints as needed.
