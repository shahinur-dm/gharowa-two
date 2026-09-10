import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { ensureDatabaseBootstrapped } from '@/lib/dbBootstrap';

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

    await ensureDatabaseBootstrapped();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const coupon = await Coupon.findOne({ code, isActive: true }).lean();
    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড' },
        { status: 404 }
      );
    }

    // Check expiry
    if (coupon.expiryDate) {
      const expiry = new Date(coupon.expiryDate);
      if (!isNaN(expiry.getTime()) && expiry < new Date()) {
        return NextResponse.json(
          { success: false, message: 'এই কুপনের মেয়াদ শেষ হয়ে গেছে' },
          { status: 400 }
        );
      }
    }

    // Check min order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { success: false, message: `এই কুপনটি ন্যূনতম ৳${coupon.minOrderAmount} অর্ডারে প্রযোজ্য` },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        titleBn: coupon.titleBn,
        titleEn: coupon.titleEn,
        discountAmount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
