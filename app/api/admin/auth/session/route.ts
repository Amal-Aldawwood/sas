import { NextRequest, NextResponse } from 'next/server';
import { findUserById } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN-SESSION] Session request received');
    
    // Get session from cookie
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie?.value) {
      console.log('[ADMIN-SESSION] No session cookie found');
      return NextResponse.json({ 
        user: null,
        message: 'No session cookie found'
      });
    }
    
    // Parse session data
    let sessionData;
    try {
      sessionData = JSON.parse(sessionCookie.value);
      console.log('[ADMIN-SESSION] Session data parsed:', sessionData);
    } catch (e) {
      console.error('[ADMIN-SESSION] Failed to parse session data:', e);
      return NextResponse.json({ 
        user: null,
        message: 'Invalid session format'
      });
    }
    
    const { userId, role } = sessionData;
    
    if (!userId || role !== 'SUPER_ADMIN') {
      console.log('[ADMIN-SESSION] Invalid session data:', { userId, role });
      return NextResponse.json({ 
        user: null, 
        message: 'Invalid session data' 
      });
    }
    
    // Get user from mock data
    console.log('[ADMIN-SESSION] Looking up user:', userId);
    const user = findUserById(userId);
    
    if (!user) {
      console.log('[ADMIN-SESSION] User not found');
      return NextResponse.json({ 
        user: null,
        message: 'User not found'
      });
    }
    
    if (user.role !== 'SUPER_ADMIN') {
      console.log('[ADMIN-SESSION] User is not a SUPER_ADMIN:', user.role);
      return NextResponse.json({ 
        user: null,
        message: 'User is not authorized as admin'
      });
    }
    
    // Return user data (excluding password)
    console.log('[ADMIN-SESSION] Valid admin user found, returning data');
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      },
      message: 'Valid session'
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
}
