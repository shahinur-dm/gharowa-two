import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CouponData {
  _id: string;
  code: string;
  titleBn: string;
  titleEn: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: string;
}

// In-memory coupons store
let globalCoupons: CouponData[] = [
  {
    _id: 'coupon-1',
    code: 'GHAROWA50',
    titleBn: '৫০ টাকা ছাড় (সকল অর্ডারে)',
    titleEn: '৳50 Off on orders above ৳400',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 400,
    maxDiscountAmount: 50,
    expiryDate: '2026-12-31',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'coupon-2',
    code: 'SPECIAL10',
    titleBn: '১০% স্পেশাল ডিসকাউন্ট',
    titleEn: '10% Off on orders above ৳600',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 600,
    maxDiscountAmount: 150,
    expiryDate: '2026-12-31',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(
    { success: true, count: globalCoupons.length, data: globalCoupons },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.code) {
      return NextResponse.json(
        { success: false, message: 'কুপন কোড আবশ্যক' },
        { status: 400 }
      );
    }

    const newCoupon: CouponData = {
      _id: `coupon-${Date.now()}`,
      code: String(body.code).toUpperCase().trim(),
      titleBn: body.titleBn ? String(body.titleBn).trim() : '',
      titleEn: body.titleEn ? String(body.titleEn).trim() : '',
      discountType: body.discountType === 'fixed' ? 'fixed' : 'percentage',
      discountValue: Number(body.discountValue) || 10,
      minOrderAmount: Number(body.minOrderAmount) || 0,
      maxDiscountAmount: body.maxDiscountAmount ? Number(body.maxDiscountAmount) : undefined,
      expiryDate: body.expiryDate || '2026-12-31',
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
    };

    globalCoupons.unshift(newCoupon);

    return NextResponse.json(
      { success: true, message: 'কুপন সফলভাবে তৈরি হয়েছে', data: newCoupon },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
