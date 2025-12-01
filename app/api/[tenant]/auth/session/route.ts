import { NextRequest, NextResponse } from 'next/server';
import { prisma, getTenantBySubdomain } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Get tenant subdomain from route parameter
    const { tenant: subdomain } = params;
    
    // Verify tenant exists
    const tenant = await getTenantBySubdomain(subdomain);
    
    if (!tenant) {
      return NextResponse.json({ user: null });
    }
    
    // Get session from tenant-specific cookie
    const sessionCookie = request.cookies.get(`${subdomain}_session`);
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null });
    }
    
    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);
    const { userId, tenantId } = sessionData;
    
    // Verify session belongs to this tenant
    if (!userId || tenantId !== tenant.id) {
      return NextResponse.json({ user: null });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    // Verify user belongs to this tenant
    if (!user || user.tenantId !== tenant.id) {
      return NextResponse.json({ user: null });
    }
    
    // Return user data (excluding password)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      },
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
    console.error('Tenant session error:', error);
    return NextResponse.json({ user: null });
  }
}
