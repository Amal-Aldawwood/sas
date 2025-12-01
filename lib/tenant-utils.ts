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

/**
 * Utility to validate if a tenant exists
 * 
 * @param subdomain The tenant's subdomain to validate
 * @returns Promise resolving to true if tenant exists, false otherwise
 */
export async function validateTenantExists(subdomain: string): Promise<boolean> {
  try {
    console.log(`[TENANT-UTILS] Validating tenant: ${subdomain}`);
    
    // Call the tenant-info API to check if the tenant exists
    const response = await fetch(`/api/${subdomain}/auth/tenant-info`);
    const exists = response.ok;
    
    console.log(`[TENANT-UTILS] Tenant validation result for ${subdomain}: ${exists}`);
    return exists;
  } catch (error) {
    console.error(`[TENANT-UTILS] Error validating tenant ${subdomain}:`, error);
    return false;
  }
}
