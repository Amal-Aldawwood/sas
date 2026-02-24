import { NextRequest, NextResponse } from 'next/server';
import { findTenantBySubdomain } from '@/lib/mock-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Get tenant subdomain from route parameter
    let { tenant: subdomain } = params;
    
    console.log(`[DEBUG] Tenant API called with subdomain: ${subdomain}`);
    
    // Check for direct access pattern
    const directAccessPrefixes = ['direct-access-'];
    const isDirectAccess = directAccessPrefixes.some(prefix => subdomain.startsWith(prefix));
    
    if (isDirectAccess) {
      // Find the matching prefix
      const prefix = directAccessPrefixes.find(p => subdomain.startsWith(p));
      if (prefix) {
        // Extract the actual tenant subdomain
        const actualSubdomain = subdomain.substring(prefix.length);
        console.log(`[DEBUG] Direct access pattern detected. Original: ${subdomain}, Actual: ${actualSubdomain}`);
        subdomain = actualSubdomain;
      }
    }
    
    // Fetch tenant information from our mock data
    const tenant = findTenantBySubdomain(subdomain);
    
    if (!tenant) {
      console.error(`[ERROR] Tenant not found for subdomain: ${subdomain}`);
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    // Return tenant data
    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
        logoUrl: tenant.logoUrl,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor
      }
    });
  } catch (error) {
    console.error('Error fetching tenant info:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tenant information' },
      { status: 500 }
    );
  }
}
