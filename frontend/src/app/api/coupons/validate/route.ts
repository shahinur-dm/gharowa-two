import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body.code || '').toUpperCase().trim();
    const subtotal = Number(body.subtotal) || 0;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'দয়া করে একটি কুপন কোড লিখুন' },
        { status: 400 }
      );
    }

    if (code === 'GHAROWA50') {
      if (subtotal < 400) {
        return NextResponse.json(
          { success: false, message: 'এই কুপনটি ন্যূনতম ৳৪০০ অর্ডারে প্রযোজ্য' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        data: {
          code: 'GHAROWA50',
          discountAmount: 50,
          discountType: 'fixed',
          discountValue: 50,
        },
      });
    }

    if (code === 'SPECIAL10') {
      if (subtotal < 600) {
        return NextResponse.json(
          { success: false, message: 'এই কুপনটি ন্যূনতম ৳৬০০ অর্ডারে প্রযোজ্য' },
          { status: 400 }
        );
      }
      const discount = Math.min(150, Math.round(subtotal * 0.1));
      return NextResponse.json({
        success: true,
        data: {
          code: 'SPECIAL10',
          discountAmount: discount,
          discountType: 'percentage',
          discountValue: 10,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
