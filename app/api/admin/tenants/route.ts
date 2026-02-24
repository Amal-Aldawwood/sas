import { NextRequest, NextResponse } from 'next/server';
import { getAllTenants, mockTenants, addTenant, addUser } from '@/lib/mock-data';
import { Role } from '@prisma/client';

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
    const { 
      name, 
      subdomain, 
      primaryColor, 
      secondaryColor, 
      logoUrl,
      adminName,
      adminEmail,
      adminPassword
    } = body;
    
    // Validate required fields for tenant
    if (!name || !subdomain) {
      return NextResponse.json(
        { message: 'Name and subdomain are required' },
        { status: 400 }
      );
    }
    
    // Validate required admin account fields
    if (!adminEmail || !adminPassword || !adminName) {
      return NextResponse.json(
        { message: 'Admin name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(adminEmail)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Validate subdomain format (letters, numbers, hyphens only)
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json(
        { message: 'Subdomain must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }
    
    // Validate password strength (minimum 8 characters)
    if (adminPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
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
    
    // Create and add the new tenant using the helper function
    const newTenant = addTenant({
      name,
      subdomain,
      primaryColor: primaryColor || '#007bff',
      secondaryColor: secondaryColor || '#6c757d',
      logoUrl: logoUrl || null,
    });
    
    console.log('[ADMIN-TENANTS-API] Created new tenant:', newTenant);
    
    // Create an admin user for this tenant
    const newUser = addUser({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: Role.ADMIN,
      tenantId: newTenant.id
    });
    
    console.log('[ADMIN-TENANTS-API] Created admin user for tenant:', newUser);
    
    // Return the newly created tenant
    return NextResponse.json({
      message: 'Tenant created successfully',
      tenant: newTenant
    });
  } catch (error: any) {
    console.error('[ADMIN-TENANTS-API] Error creating tenant:', error);
    return NextResponse.json(
      { message: error.message || 'Error creating tenant' },
      { status: 500 }
    );
  }
}
