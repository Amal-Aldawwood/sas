/**
 * Utility functions for tenant-related operations
 */

/**
 * Generates a correctly formatted tenant URL path based on the current environment
 * This handles both the /tenant/[subdomain] format for local development
 * and direct paths for production
 * 
 * @param subdomain The tenant's subdomain
 * @param path The path to navigate to (without leading slash)
 * @returns The correctly formatted path
 */
export function getTenantPath(subdomain: string, path: string = 'dashboard'): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log(`[TENANT-UTILS] Generating tenant path for subdomain: ${subdomain}, path: ${cleanPath}, hostname: ${hostname}`);
    
    // Check if we're on localhost or using a direct domain (not subdomain)
    if (hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.split('.').length <= 2) {
      // Use tenant path format for local development
      const tenantPath = `/tenant/${subdomain}/${cleanPath}`;
      console.log(`[TENANT-UTILS] Using local development path format: ${tenantPath}`);
      return tenantPath;
    }
    
    // For subdomain access, use direct paths
    console.log(`[TENANT-UTILS] Using subdomain path format: /${cleanPath}`);
    return `/${cleanPath}`;
  }
  
  // Server-side or during build, default to tenant path
  const fallbackPath = `/tenant/${subdomain}/${cleanPath}`;
  console.log(`[TENANT-UTILS] Using server-side fallback path: ${fallbackPath}`);
  return fallbackPath;
}

/**
 * Creates a full tenant URL including protocol and domain
 * 
 * @param subdomain The tenant's subdomain
 * @param path Optional path to append (without leading slash)
 * @returns The full tenant URL
 */
export function getTenantFullUrl(subdomain: string, path: string = ''): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Default to secure protocol
  const protocol = 'https';
  
  // For local development use localhost
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'))) {
    const port = window.location.port ? `:${window.location.port}` : '';
    const localUrl = `http://localhost${port}/tenant/${subdomain}/${cleanPath}`;
    console.log(`[TENANT-UTILS] Generated local URL: ${localUrl}`);
    return localUrl;
  }
  
  // In production, use subdomain
  const productionUrl = `${protocol}://${subdomain}.yourapp.com/${cleanPath}`;
  console.log(`[TENANT-UTILS] Generated production URL: ${productionUrl}`);
  return productionUrl;
}

// Import the mock data functions
import { findTenantBySubdomain } from './mock-data';

/**
 * Utility to validate if a tenant exists
 * 
 * @param subdomain The tenant's subdomain to validate
 * @returns Promise resolving to true if tenant exists, false otherwise
 */
export async function validateTenantExists(subdomain: string): Promise<boolean> {
  try {
    console.log(`[TENANT-UTILS] Validating tenant: ${subdomain}`);
    
    // Use the mock data directly instead of making API calls
    // This is more reliable for local development
    const tenant = findTenantBySubdomain(subdomain);
    const exists = !!tenant;
    
    console.log(`[TENANT-UTILS] Tenant validation result for ${subdomain}: ${exists}`);
    
    // If the tenant exists in mock data, return true immediately
    if (exists) {
      return true;
    }
    
    // For direct access patterns (e.g., direct-access-clinr)
    // Extract tenant name if it has a prefix
    const directAccessPrefixes = ['direct-access-'];
    const hasPrefix = directAccessPrefixes.some(prefix => subdomain.startsWith(prefix));
    
    if (hasPrefix) {
      // Find the matching prefix
      const prefix = directAccessPrefixes.find(p => subdomain.startsWith(p));
      if (prefix) {
        // Extract the actual tenant subdomain
        const actualSubdomain = subdomain.substring(prefix.length);
        console.log(`[TENANT-UTILS] Checking direct access subdomain: ${actualSubdomain}`);
        
        // Check if the actual subdomain exists
        const actualTenant = findTenantBySubdomain(actualSubdomain);
        const actualExists = !!actualTenant;
        
        console.log(`[TENANT-UTILS] Direct access tenant validation for ${actualSubdomain}: ${actualExists}`);
        return actualExists;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`[TENANT-UTILS] Error validating tenant ${subdomain}:`, error);
    return false;
  }
}
