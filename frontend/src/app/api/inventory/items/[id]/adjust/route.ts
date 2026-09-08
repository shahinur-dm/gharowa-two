import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'ইনভেন্টরি স্টক সফলভাবে আপডেট করা হয়েছে',
      data: {
        id,
        adjustment: body,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
