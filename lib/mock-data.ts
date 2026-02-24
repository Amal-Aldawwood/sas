/**
 * This file provides mock data for the application to function without a database connection,
 * but now with file-based persistence between server restarts.
 */

import { Tenant, User, Role } from '@prisma/client';
import {
  initTenantStorage,
  initUserStorage,
  loadTenants,
  loadUsers,
  saveTenants,
  saveUsers,
  addTenantToStorage,
  addUserToStorage,
  updateTenantInStorage
} from './file-storage';

// Initial mock tenant data (used only if no data file exists)
const initialTenants: Tenant[] = [
  {
    id: '1',
    name: 'AlNajah Company',
    subdomain: 'alnajah',
    logoUrl: null,
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'AlMajd Corporation',
    subdomain: 'almajd',
    logoUrl: null,
    primaryColor: '#28a745',
    secondaryColor: '#ffc107',
    createdAt: new Date(),
    updatedAt: new Date()
  },
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
];

// Initial mock user data (used only if no data file exists)
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@yourapp.com',
    password: 'your-secure-password',  // In real apps, this would be hashed
    role: Role.SUPER_ADMIN,
    tenantId: '1',  // Belongs to AlNajah
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Tenant Admin',
    email: 'admin@alnajah.com',
    password: 'password123',
    role: Role.ADMIN,
    tenantId: '1',  // Belongs to AlNajah
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Tenant User',
    email: 'user@almajd.com',
    password: 'password123',
    role: Role.USER,
    tenantId: '2',  // Belongs to AlMajd
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Clinr Admin',
    email: 'admin@clinr.com',
    password: 'password123',
    role: Role.ADMIN,
    tenantId: '3',  // Belongs to Clinr
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// In-memory cache of data - start with empty arrays to ensure we prioritize loading from files
export let mockTenants: Tenant[] = [];
export let mockUsers: User[] = [];

// Initialize the file storage system with initial data and load existing data
// This is an async function but we execute it immediately and update the mockTenants/mockUsers when done
(async function initializeStorage() {
  console.log('[MOCK-DATA] Initializing file-based storage');
  try {
    // Initialize storage with initial data (only creates if doesn't exist)
    await initTenantStorage(initialTenants);
    await initUserStorage(initialUsers);
    
    // Load data from storage
    const tenants = await loadTenants();
    const users = await loadUsers();
    
    // Update our in-memory cache with data from storage
    mockTenants = tenants.length > 0 ? tenants : [...initialTenants];
    mockUsers = users.length > 0 ? users : [...initialUsers];
    
    console.log(`[MOCK-DATA] Loaded ${mockTenants.length} tenants and ${mockUsers.length} users from storage`);
  } catch (error) {
    console.error('[MOCK-DATA] Error initializing storage:', error);
    // Continue with initial data if loading fails
    console.log('[MOCK-DATA] Using initial data instead');
    mockTenants = [...initialTenants];
    mockUsers = [...initialUsers];
  }
})();

// Helper function to find a user by email and password
export function findUserByCredentials(email: string, password: string): User | null {
  return mockUsers.find(user => user.email === email && user.password === password) || null;
}

// Helper function to find a user by ID
export function findUserById(id: string): User | null {
  return mockUsers.find(user => user.id === id) || null;
}

// Helper function to find a tenant by subdomain
export function findTenantBySubdomain(subdomain: string): Tenant | null {
  return mockTenants.find(tenant => tenant.subdomain === subdomain) || null;
}

// Helper function to get all tenants
export function getAllTenants(): Tenant[] {
  return mockTenants;
}

// Helper function to add a new tenant
export function addTenant(tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Tenant {
  const newTenant: Tenant = {
    ...tenant,
    id: `${mockTenants.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add to in-memory array
  mockTenants.push(newTenant);
  
  // Persist to file storage (async, but we don't wait for it)
  (async () => {
    try {
      // Save the entire tenants array to ensure all tenants are persisted
      await saveTenants(mockTenants);
      console.log('[MOCK-DATA] Successfully persisted all tenants to storage');
    } catch (error) {
      console.error('[MOCK-DATA] Error persisting tenant:', error);
    }
  })();
  
  console.log('[MOCK-DATA] Added new tenant:', newTenant);
  return newTenant;
}

// Helper function to add a new user
export function addUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const newUser: User = {
    ...user,
    id: `${mockUsers.length + 1}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add to in-memory array
  mockUsers.push(newUser);
  
  // Persist to file storage (async, but we don't wait for it)
  (async () => {
    try {
      // Save the entire users array to ensure all users are persisted
      await saveUsers(mockUsers);
      console.log('[MOCK-DATA] Successfully persisted all users to storage');
    } catch (error) {
      console.error('[MOCK-DATA] Error persisting user:', error);
    }
  })();
  
  console.log('[MOCK-DATA] Added new user:', newUser);
  return newUser;
}

// Helper function to update an existing tenant
export function updateTenant(id: string, tenantData: Partial<Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>>): Tenant | null {
  const tenantIndex = mockTenants.findIndex(t => t.id === id);
  
  if (tenantIndex === -1) {
    console.log(`[MOCK-DATA] Tenant with ID ${id} not found for update`);
    return null;
  }
  
  // Check if subdomain is being changed and ensure it's unique
  if (tenantData.subdomain && tenantData.subdomain !== mockTenants[tenantIndex].subdomain) {
    const existingTenant = mockTenants.find(t => t.subdomain === tenantData.subdomain);
    if (existingTenant) {
      console.log(`[MOCK-DATA] Cannot update tenant: subdomain ${tenantData.subdomain} is already taken`);
      throw new Error("Subdomain is already taken");
    }
  }
  
  // Update the tenant in the array
  mockTenants[tenantIndex] = {
    ...mockTenants[tenantIndex],
    ...tenantData,
    updatedAt: new Date()
  };
  
  // Persist updates to file storage (async, but we don't wait for it)
  (async () => {
    try {
      // Save all tenants to ensure the entire array is persisted
      await saveTenants(mockTenants);
      console.log('[MOCK-DATA] Successfully persisted all tenants to storage after update');
    } catch (error) {
      console.error('[MOCK-DATA] Error persisting tenant updates:', error);
    }
  })();
  
  console.log('[MOCK-DATA] Updated tenant:', mockTenants[tenantIndex]);
  return mockTenants[tenantIndex];
}
