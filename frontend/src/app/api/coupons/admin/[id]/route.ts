import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Coupon } from '@/models/Coupon';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const updates: any = { ...body };
    if (body.code) updates.code = String(body.code).toUpperCase().trim();
    if (body.discountValue !== undefined) updates.discountValue = Number(body.discountValue);
    if (body.minOrderAmount !== undefined) updates.minOrderAmount = Number(body.minOrderAmount);
    if (body.maxDiscountAmount !== undefined) updates.maxDiscountAmount = Number(body.maxDiscountAmount);

    let updated = null;
    if (mongoose.isValidObjectId(id)) {
      updated = await Coupon.findByIdAndUpdate(id, updates, { new: true }).lean();
    } else {
      updated = await Coupon.findOneAndUpdate({ code: id }, updates, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Coupon updated successfully', data: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    if (mongoose.isValidObjectId(id)) {
      await Coupon.findByIdAndDelete(id);
    } else {
      await Coupon.findOneAndDelete({ code: id });
    }

    return NextResponse.json(
      { success: true, message: 'Coupon deleted successfully', data: { id } },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
