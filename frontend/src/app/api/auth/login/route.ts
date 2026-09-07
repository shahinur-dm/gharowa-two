import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const trimmedEmail = (email || '').trim().toLowerCase();

    // Check credentials (supports super admin and common admin emails)
    if (
      (trimmedEmail === 'admin@gharowa.com' && password === 'Admin@Gharowa1972') ||
      (trimmedEmail === 'admin@gharowa.com' && password === 'admin123')
    ) {
      const user = {
        id: 'admin-1972',
        name: 'Gharowa Master Admin',
        email: 'admin@gharowa.com',
        role: 'super_admin',
        permissions: ['all'],
      };

      const token = `gharowa_jwt_${Date.now()}_super_admin_authenticated`;

      return NextResponse.json(
        {
          success: true,
          message: 'লগইন সফল হয়েছে / Login successful',
          token,
          user,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'ভুল ইমেইল বা পাসওয়ার্ড / Invalid email or password',
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Login failed',
      },
      { status: 500 }
    );
  }
}
