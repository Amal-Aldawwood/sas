import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import { findUserByCredentials } from '@/lib/mock-data';

// Helper function to verify password
function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
  // For demonstration purposes, we're using a simple direct comparison
  // In a real app, you would use a proper library like bcrypt
  return storedPassword === suppliedPassword;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email and password using mock data
    const user = findUserByCredentials(email, password);

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is a super admin
    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Create a session by storing user info
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
    response.cookies.set('admin_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
