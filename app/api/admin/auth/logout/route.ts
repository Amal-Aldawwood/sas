import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[ADMIN-LOGOUT] Admin logout requested');
    
    // Create a response
    const response = NextResponse.json({
      message: 'Logged out successfully'
    });
    
    // Clear the admin session cookie
    response.cookies.delete('admin_session');
    console.log('[ADMIN-LOGOUT] Admin session cookie cleared');
    
    return response;
  } catch (error) {
    console.error('[ADMIN-LOGOUT] Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
