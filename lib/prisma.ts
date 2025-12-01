import { PrismaClient } from '@prisma/client';
import { findTenantBySubdomain } from './mock-data';

// This logic helps prevent multiple Prisma Client instances during hot reloading in development
// and creates a single instance in production

// NOTE: This entire file has been modified to work with mock data
// In a real application, this would connect to a real database

declare global {
  var prisma: PrismaClient | undefined;
}

// Export a Prisma Client instance
// In production, this would be a real connection to the database
// For our purposes, we're just creating a client but not using it
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

/**
 * Get a tenant by its subdomain
 * NOTE: This now uses mock data instead of a real database query
 */
export async function getTenantBySubdomain(subdomain: string) {
  if (!subdomain) return null;
  
  try {
    console.log(`Looking for tenant with subdomain: ${subdomain}`);
    
    // Use our mock data instead of prisma
    const tenant = findTenantBySubdomain(subdomain);
    return tenant;
    
  } catch (error) {
    console.error('Error getting tenant by subdomain:', error);
    return null;
  }
}
