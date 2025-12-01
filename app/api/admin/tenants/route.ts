import { NextRequest, NextResponse } from 'next/server';
import { getAllTenants, mockTenants } from '@/lib/mock-data';

// GET - Get all tenants
export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN-TENANTS-API] Getting all tenants');
    
    // Get all tenants from mock data
    const tenants = getAllTenants();
    
    return NextResponse.json({
      tenants,
      count: tenants.length
    });
  } catch (error) {
    console.error('[ADMIN-TENANTS-API] Error getting tenants:', error);
    return NextResponse.json(
      { message: 'Error getting tenants' },
      { status: 500 }
    );
  }
}

// POST - Create a new tenant
export async function POST(request: NextRequest) {
  try {
    console.log('[ADMIN-TENANTS-API] Creating new tenant');
    
    const body = await request.json();
    const { name, subdomain, primaryColor, secondaryColor, logoUrl } = body;
    
    // Validate required fields
    if (!name || !subdomain) {
      return NextResponse.json(
        { message: 'Name and subdomain are required' },
        { status: 400 }
      );
    }
    
    // Check if subdomain is already taken
    const existingTenant = mockTenants.find(t => t.subdomain === subdomain);
    if (existingTenant) {
      return NextResponse.json(
        { message: 'Subdomain is already taken' },
        { status: 400 }
      );
    }
    
    // In a real application, this would create a new tenant in the database
    // For our mock data, we'll just return a success message
    // In a real app, you would add this to the mockTenants array
    
    return NextResponse.json({
      message: 'Tenant created successfully',
      tenant: {
        id: `mock-id-${Date.now()}`,
        name,
        subdomain,
        primaryColor: primaryColor || '#007bff',
        secondaryColor: secondaryColor || '#6c757d',
        logoUrl: logoUrl || null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('[ADMIN-TENANTS-API] Error creating tenant:', error);
    return NextResponse.json(
      { message: 'Error creating tenant' },
      { status: 500 }
    );
  }
}
