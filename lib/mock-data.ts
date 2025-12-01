/**
 * This file provides mock data for the application to function without a database connection
 */

import { Tenant, User, Role } from '@prisma/client';

// Mock tenant data
export const mockTenants: Tenant[] = [
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
  }
];

// Mock user data
export const mockUsers: User[] = [
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
  }
];

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
