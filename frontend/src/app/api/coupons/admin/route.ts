import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';
import { ensureDatabaseBootstrapped } from '@/lib/dbBootstrap';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await ensureDatabaseBootstrapped();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      { success: true, count: coupons.length, data: coupons },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
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

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    const codeUpper = String(body.code).toUpperCase().trim();
    const existing = await Coupon.findOne({ code: codeUpper });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'এই কুপন কোডটি ইতিমধ্যে বিদ্যমান' },
        { status: 400 }
      );
    }

    const newCoupon = await Coupon.create({
      code: codeUpper,
      titleBn: body.titleBn ? String(body.titleBn).trim() : '',
      titleEn: body.titleEn ? String(body.titleEn).trim() : '',
      discountType: body.discountType === 'percentage' ? 'percentage' : 'fixed',
      discountValue: Number(body.discountValue) || 10,
      minOrderAmount: Number(body.minOrderAmount) || 0,
      maxDiscountAmount: body.maxDiscountAmount ? Number(body.maxDiscountAmount) : undefined,
      expiryDate: body.expiryDate || '2026-12-31',
      isActive: body.isActive !== false,
    });

    return NextResponse.json(
      { success: true, message: 'কুপন সফলভাবে তৈরি ও সংরক্ষণ করা হয়েছে', data: newCoupon },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create coupon' },
      { status: 500 }
    );
  }
}
