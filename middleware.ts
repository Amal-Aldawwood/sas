import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    // Match all paths except static files
    // Note: We now include API routes in the matcher since we need to rewrite tenant API routes
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
  ],
};

export default function middleware(request: NextRequest) {
  // Get the hostname from the request
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  const path = url.pathname;
  
  // Extract subdomain from hostname
  // This will work both locally and in production
  const subdomain = getSubdomain(hostname);
  
  // Handle different types of routes based on subdomain
  
  console.log(`[MIDDLEWARE] Processing request: ${url.pathname}, Hostname: ${hostname}, Subdomain: ${subdomain}`);
  
  // Root path (/) now serves as the admin dashboard without auth
  // Simply allow access to it
  if (path === '/') {
    console.log('[MIDDLEWARE] Root path accessed - allowing access to admin dashboard');
    return NextResponse.next();
  }

  // Special handling for admin dashboard path
  if (path === '/admin/dashboard') {
    console.log('[MIDDLEWARE] Admin dashboard path - redirecting to root');
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Handle admin subdomain or admin path on localhost (except root /)
  if (subdomain === 'admin' || path.startsWith('/admin')) {
    console.log(`[MIDDLEWARE] Handling admin path: ${path}`);
    
    // Admin paths should not be handled as tenant paths
    // Redirect to admin dashboard for /admin
    if (path === '/admin' || path === '/admin/') {
      url.pathname = '/';
      console.log('[MIDDLEWARE] Redirecting /admin to root admin dashboard');
      return NextResponse.redirect(url);
    }
    
    // Allow all other admin paths to pass through without tenant validation
    console.log('[MIDDLEWARE] Admin path - allowing access without auth check');
    return NextResponse.next();
  }
  
  // Special handling for localhost development without subdomains
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    console.log(`[MIDDLEWARE] Processing localhost path: ${path}`);
    
    // Allow direct access to tenant routes during development
    // Format: /tenant/{tenantSubdomain}/dashboard
    const segments = path.split('/').filter(Boolean);
    console.log(`[MIDDLEWARE] Path segments:`, segments);
    
    if (segments[0] === 'tenant' && segments.length > 1) {
      const tenantSubdomain = segments[1];
      const remainingPath = segments.slice(2).join('/') || 'dashboard';
      
      console.log(`[MIDDLEWARE] Tenant path detected: ${tenantSubdomain}, remainingPath: ${remainingPath}`);
      
      // Rewrite to the correct customer route
      // We need to use the correct Next.js app directory format
      url.pathname = `/${tenantSubdomain}/${remainingPath}`;
      console.log(`[MIDDLEWARE] Rewriting to: ${url.pathname}`);
      return NextResponse.rewrite(new URL(url.pathname, request.url));
    }
    
    // Handle direct access to tenant routes with the subdomain as the first segment
    // Format: /{tenantSubdomain}/dashboard
    if (segments.length > 0 && !['admin', 'api', '_next'].includes(segments[0])) {
      const potentialTenantSubdomain = segments[0];
      const remainingPath = segments.slice(1).join('/') || 'dashboard';
      
      // Try to rewrite to the tenant route - the tenant layout will handle verification
      url.pathname = `/${potentialTenantSubdomain}/${remainingPath}`;
      return NextResponse.rewrite(new URL(url.pathname, request.url));
    }
  }
  
  // Handle API routes for tenants
  // Format: /api/{tenantSubdomain}/...
  if (path.startsWith('/api/') && !path.startsWith('/api/admin') && !path.startsWith('/api/debug')) {
    // Extract tenant from the API path: /api/{tenant}/...
    const segments = path.split('/').filter(Boolean);
    console.log(`[MIDDLEWARE] API route segments:`, segments);
    
    if (segments.length >= 2) {
      const tenantSubdomain = segments[1];
      console.log(`[MIDDLEWARE] API request for tenant: ${tenantSubdomain}`);
      
      // No rewrite needed for API routes, they are already in the correct format
      // Let Next.js handle this correctly through the [tenant] parameter
      return NextResponse.next();
    }
  }

  // Handle tenant-specific subdomains
  if (subdomain && subdomain !== 'www') {
    // For the root path, redirect to the dashboard
    if (path === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Rewrite request to the tenant-specific route structure
    // Use the correct Next.js app directory format for app/(customer)/[tenant]/...
    const pathWithoutLeadingSlash = path.startsWith('/') ? path.substring(1) : path;
    url.pathname = `/${subdomain}/${pathWithoutLeadingSlash}`;
    
    return NextResponse.rewrite(new URL(url.pathname, request.url));
  }
  
  // For other paths, assume they are on the marketing site
  return NextResponse.next();
}

// Helper function to extract subdomain
function getSubdomain(hostname: string): string | null {
  console.log(`[MIDDLEWARE] Extracting subdomain from hostname: ${hostname}`);
  
  // Handle localhost subdomains for development (e.g. admin.localhost:3000)
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const parts = hostname.split('.');
    console.log(`[MIDDLEWARE] Hostname parts:`, parts);
    
    if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== '127.0.0.1') {
      console.log(`[MIDDLEWARE] Found subdomain: ${parts[0]}`);
      return parts[0];
    }
    
    console.log(`[MIDDLEWARE] No subdomain found for localhost`);
    return null;
  }
  
  // Split hostname by dots and get the first part
  const parts = hostname.split('.');
  console.log(`[MIDDLEWARE] Hostname parts:`, parts);
  
  // Check if we have a subdomain (e.g., admin.yourapp.com)
  if (parts.length > 2) {
    console.log(`[MIDDLEWARE] Found subdomain: ${parts[0]}`);
    return parts[0];
  }
  
  console.log(`[MIDDLEWARE] No subdomain found`);
  return null;
}
