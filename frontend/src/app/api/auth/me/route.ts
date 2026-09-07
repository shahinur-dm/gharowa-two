import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  return NextResponse.json({
    success: true,
    user: {
      id: 'admin-1972',
      name: 'Gharowa Master Admin',
      email: 'admin@gharowa.com',
      role: 'super_admin',
    },
  });
}
