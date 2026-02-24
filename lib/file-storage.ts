import { Tenant, User, Role } from '@prisma/client';

// API endpoint for storage operations
const STORAGE_API_ENDPOINT = '/api/storage';

// Helper method for fetch requests
async function fetchWithErrorHandling(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`[FILE-STORAGE] Fetch error:`, error);
    throw error;
  }
}

// Initialize tenant storage
export async function initTenantStorage(initialTenants: Tenant[]): Promise<void> {
  try {
    await fetchWithErrorHandling(`${STORAGE_API_ENDPOINT}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        type: 'tenants',
        initialData: initialTenants
      })
    });
    
    console.log(`[FILE-STORAGE] Initialized tenants storage with ${initialTenants.length} tenants`);
  } catch (error) {
    console.error('[FILE-STORAGE] Error initializing tenants storage:', error);
  }
}

// Initialize user storage
export async function initUserStorage(initialUsers: User[]): Promise<void> {
  try {
    await fetchWithErrorHandling(`${STORAGE_API_ENDPOINT}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'users',
        initialData: initialUsers
      })
    });
    
    console.log(`[FILE-STORAGE] Initialized users storage with ${initialUsers.length} users`);
  } catch (error) {
    console.error('[FILE-STORAGE] Error initializing users storage:', error);
  }
}

// Load tenants from API
export async function loadTenants(): Promise<Tenant[]> {
  try {
    const result = await fetchWithErrorHandling(`${STORAGE_API_ENDPOINT}?type=tenants`, {
      method: 'GET'
    });
    
    if (result.tenants) {
      const tenants = result.tenants as Tenant[];
      
      // Convert string dates back to Date objects
      tenants.forEach(tenant => {
        tenant.createdAt = new Date(tenant.createdAt);
        tenant.updatedAt = new Date(tenant.updatedAt);
      });
      
      console.log(`[FILE-STORAGE] Loaded ${tenants.length} tenants from storage API`);
      return tenants;
    }
  } catch (error) {
    console.error('[FILE-STORAGE] Error loading tenants from storage:', error);
  }
  
  return [];
}

// Load users from API
export async function loadUsers(): Promise<User[]> {
  try {
    const result = await fetchWithErrorHandling(`${STORAGE_API_ENDPOINT}?type=users`, {
      method: 'GET'
    });
    
    if (result.users) {
      const users = result.users as User[];
      
      // Convert string dates back to Date objects
      users.forEach(user => {
        user.createdAt = new Date(user.createdAt);
        user.updatedAt = new Date(user.updatedAt);
      });
      
      console.log(`[FILE-STORAGE] Loaded ${users.length} users from storage API`);
      return users;
    }
  } catch (error) {
    console.error('[FILE-STORAGE] Error loading users from storage:', error);
  }
  
  return [];
}

// Save tenants via API
export async function saveTenants(tenants: Tenant[]): Promise<void> {
  try {
    await fetchWithErrorHandling(`${STORAGE_API_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'tenants',
        data: tenants
      })
    });
    
    console.log(`[FILE-STORAGE] Saved ${tenants.length} tenants to storage API`);
  } catch (error) {
    console.error('[FILE-STORAGE] Error saving tenants to storage:', error);
  }
}

// Save users via API
export async function saveUsers(users: User[]): Promise<void> {
  try {
    await fetchWithErrorHandling(`${STORAGE_API_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'users',
        data: users
      })
    });
    
    console.log(`[FILE-STORAGE] Saved ${users.length} users to storage API`);
  } catch (error) {
    console.error('[FILE-STORAGE] Error saving users to storage:', error);
  }
}

// Add a tenant to storage
export async function addTenantToStorage(tenant: Tenant): Promise<void> {
  try {
    const tenants = await loadTenants();
    
    // Check if tenant with same ID already exists
    const existingIndex = tenants.findIndex(t => t.id === tenant.id);
    
    if (existingIndex >= 0) {
      // Replace existing tenant if found
      tenants[existingIndex] = tenant;
      console.log(`[FILE-STORAGE] Updated existing tenant "${tenant.name}" in storage API`);
    } else {
      // Add as new tenant
      tenants.push(tenant);
      console.log(`[FILE-STORAGE] Added new tenant "${tenant.name}" to storage API`);
    }
    
    // Save all tenants
    await saveTenants(tenants);
  } catch (error) {
    console.error('[FILE-STORAGE] Error adding tenant to storage:', error);
  }
}

// Add a user to storage
export async function addUserToStorage(user: User): Promise<void> {
  try {
    const users = await loadUsers();
    
    // Check if user with same ID already exists
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      // Replace existing user if found
      users[existingIndex] = user;
      console.log(`[FILE-STORAGE] Updated existing user "${user.name}" in storage API`);
    } else {
      // Add as new user
      users.push(user);
      console.log(`[FILE-STORAGE] Added new user "${user.name}" to storage API`);
    }
    
    // Save all users
    await saveUsers(users);
  } catch (error) {
    console.error('[FILE-STORAGE] Error adding user to storage:', error);
  }
}

// Update a tenant in storage
export async function updateTenantInStorage(id: string, tenantData: Partial<Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Tenant | null> {
  try {
    const tenants = await loadTenants();
    const tenantIndex = tenants.findIndex(t => t.id === id);
    
    if (tenantIndex === -1) {
      console.log(`[FILE-STORAGE] Tenant with ID ${id} not found for update`);
      return null;
    }
    
    // Update the tenant
    tenants[tenantIndex] = {
      ...tenants[tenantIndex],
      ...tenantData,
      updatedAt: new Date()
    };
    
    await saveTenants(tenants);
    console.log(`[FILE-STORAGE] Updated tenant with ID ${id} in storage API`);
    return tenants[tenantIndex];
  } catch (error) {
    console.error('[FILE-STORAGE] Error updating tenant in storage:', error);
    return null;
  }
}
