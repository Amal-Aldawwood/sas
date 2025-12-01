import { NextRequest, NextResponse } from 'next/server';
import { prisma, getTenantBySubdomain } from '@/lib/prisma';

/**
 * Debug API route to check all available tenants
 * This helps diagnose tenant detection issues
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[DEBUG-API] Debug tenant API called');
    
    // Fetch all tenants
    const tenants = await prisma.tenant.findMany();
    console.log(`[DEBUG-API] Found ${tenants.length} tenants`);
    
    // Extract request parameters and headers for debugging
    const url = new URL(request.url);
    const tenantParam = url.searchParams.get('tenant');
    
    // Get request information for debugging
    const requestInfo = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      nextUrl: {
        pathname: request.nextUrl.pathname,
        search: request.nextUrl.search,
        hostname: request.nextUrl.hostname,
      },
      cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
    };
    
    // Get middleware routing info
    // Define the interface for routing examples
    interface RoutingExample {
      tenant: string;
      paths: {
        dashboard: string;
        login: string;
        api: string;
      };
    }
    
    let middlewareRouting = {
      description: 'How the middleware would route various tenant URLs',
      examples: [] as RoutingExample[]
    };
    
    // Add examples for each tenant
    for (const tenant of tenants) {
      middlewareRouting.examples.push({
        tenant: tenant.subdomain,
        paths: {
          dashboard: `/tenant/${tenant.subdomain}/dashboard`,
          login: `/tenant/${tenant.subdomain}/login`,
          api: `/api/${tenant.subdomain}/auth/tenant-info`
        }
      });
    }
    
    // If a specific tenant parameter is provided, run validation tests on it
    let tenantValidation = null;
    if (tenantParam) {
      console.log(`[DEBUG-API] Running validation for tenant: ${tenantParam}`);
      
      // Try to find the tenant
      const tenant = await getTenantBySubdomain(tenantParam);
      
      tenantValidation = {
        tenantParam,
        exists: !!tenant,
        details: tenant ? {
          id: tenant.id,
          name: tenant.name,
          subdomain: tenant.subdomain
        } : null,
        validPathExamples: tenant ? [
          `/tenant/${tenantParam}/dashboard`,
          `/tenant/${tenantParam}/login`
        ] : [],
        validApiEndpoints: tenant ? [
          `/api/${tenantParam}/auth/tenant-info`,
          `/api/${tenantParam}/auth/login`,
          `/api/${tenantParam}/auth/logout`
        ] : []
      };
    }
    
    // Return comprehensive debugging data
    return NextResponse.json({
      message: 'Debug tenant information',
      timestamp: new Date().toISOString(),
      count: tenants.length,
      tenants: tenants.map(t => ({
        id: t.id,
        name: t.name,
        subdomain: t.subdomain,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
        createdAt: t.createdAt
      })),
      tenantValidation,
      middlewareRouting,
      requestInfo,
      envInfo: {
        nodeEnv: process.env.NODE_ENV || 'development',
        nextPublicUrl: process.env.NEXT_PUBLIC_URL || 'undefined',
        // Add other non-sensitive env vars here
      },
      pathHelp: {
        note: 'Use these formats for accessing tenant resources',
        localDevelopment: {
          dashboard: '/tenant/[subdomain]/dashboard',
          login: '/tenant/[subdomain]/login',
          api: '/api/[subdomain]/auth/tenant-info'
        },
        production: {
          dashboard: 'https://[subdomain].yourapp.com/dashboard',
          login: 'https://[subdomain].yourapp.com/login',
          api: 'https://[subdomain].yourapp.com/api/auth/tenant-info'
        }
      }
    });
  } catch (error) {
    console.error('[DEBUG-API] Error in debug tenant API:', error);
    return NextResponse.json(
      { 
        message: 'Error fetching debug tenant information', 
        error: String(error),
        stack: typeof error === 'object' && error !== null ? (error as Error).stack : undefined
      },
      { status: 500 }
    );
  }
}
