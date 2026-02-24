import { NextRequest, NextResponse } from 'next/server';
import { mockTenants, updateTenant } from '@/lib/mock-data';

// GET - Get a tenant by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`[ADMIN-TENANT-API] Getting tenant with ID: ${id}`);
    
    // Find tenant in mock data
    const tenant = mockTenants.find(t => t.id === id);
    
    if (!tenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ tenant });
  } catch (error) {
    console.error('[ADMIN-TENANT-API] Error getting tenant:', error);
    return NextResponse.json(
      { message: 'Error getting tenant' },
      { status: 500 }
    );
  }
}

// PATCH - Update a tenant by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`[ADMIN-TENANT-API] Updating tenant with ID: ${id} via PATCH`);
    
    const body = await request.json();
    
    // Update tenant in mock data
    const updatedTenant = updateTenant(id, body);
    
    if (!updatedTenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Tenant updated successfully',
      tenant: updatedTenant
    });
  } catch (error: any) {
    console.error('[ADMIN-TENANT-API] Error updating tenant:', error);
    return NextResponse.json(
      { message: error.message || 'Error updating tenant' },
      { status: 500 }
    );
  }
}

// PUT - Update a tenant by ID (alias for PATCH)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`[ADMIN-TENANT-API] Updating tenant with ID: ${id} via PUT`);
    
    const body = await request.json();
    
    // Update tenant in mock data
    const updatedTenant = updateTenant(id, body);
    
    if (!updatedTenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Tenant updated successfully',
      tenant: updatedTenant
    });
  } catch (error: any) {
    console.error('[ADMIN-TENANT-API] Error updating tenant:', error);
    return NextResponse.json(
      { message: error.message || 'Error updating tenant' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tenant by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    console.log(`[ADMIN-TENANT-API] Deleting tenant with ID: ${id}`);
    
    // Find tenant in mock data
    const tenantIndex = mockTenants.findIndex(t => t.id === id);
    
    if (tenantIndex === -1) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    // In a real application, this would delete the tenant from the database
    // For our mock data, we'll just return a success message
    
    return NextResponse.json({
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    console.error('[ADMIN-TENANT-API] Error deleting tenant:', error);
    return NextResponse.json(
      { message: 'Error deleting tenant' },
      { status: 500 }
    );
  }
}
