import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { tenant: string } }
) {
  try {
    // Get tenant subdomain from route parameter
    const { tenant: subdomain } = params;
    
    // Create a response
    const response = NextResponse.json({
      message: 'Logged out successfully'
    });
    
    // Clear the tenant-specific session cookie
    response.cookies.delete(`${subdomain}_session`);
    
    return response;
  } catch (error) {
    console.error('Tenant logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
