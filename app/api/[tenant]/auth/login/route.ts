import { NextRequest, NextResponse } from 'next/server';
import { prisma, getTenantBySubdomain } from '@/lib/prisma';
import * as crypto from 'crypto';

// Helper function to verify password
function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
  // In a real app, you would use a proper library like bcrypt
  try {
    const [salt, storedHash] = storedPassword.split(':');
    const hash = crypto
      .pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512')
      .toString('hex');
    return storedHash === hash;
  } catch (error) {
    // If the stored password is not in the correct format, fall back to direct comparison
    // This is for backward compatibility with existing accounts
    console.warn('Using fallback password verification due to format issue');
    return storedPassword === suppliedPassword;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Get tenant subdomain from route parameter
    const { tenant: subdomain } = params;
    
    // Verify tenant exists
    const tenant = await getTenantBySubdomain(subdomain);
    
    if (!tenant) {
      return NextResponse.json(
        { message: 'Tenant not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email within this tenant
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists and belongs to this tenant
    if (!user || user.tenantId !== tenant.id) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password using our helper function that supports both hashed and unhashed passwords
    if (!verifyPassword(user.password, password)) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session data
    const sessionData = {
      userId: user.id,
      role: user.role,
      tenantId: user.tenantId
    };
    
    // Create a response with the user data
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
    
    // Set session cookie using response headers
    // Use tenant-specific cookie name for isolation
    response.cookies.set(`${subdomain}_session`, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Tenant login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
