import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { InventoryItem } from '@/models/InventoryItem';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const amount = Number(body.amount) || 0;
    const type = body.type || 'add'; // 'add' | 'reduce' | 'set'

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    let filter: any = {};
    if (mongoose.isValidObjectId(id)) {
      filter = { _id: id };
    } else {
      filter = { $or: [{ _id: id }, { nameEn: id }, { nameBn: id }] };
    }

    const item = await InventoryItem.findOne(filter);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Inventory item not found' }, { status: 404 });
    }

    if (type === 'set') {
      item.currentStock = Math.max(0, amount);
    } else if (type === 'reduce') {
      item.currentStock = Math.max(0, item.currentStock - amount);
    } else {
      item.currentStock = item.currentStock + amount;
    }

    item.lastRestocked = new Date().toISOString().split('T')[0];
    await item.save();

    return NextResponse.json(
      {
        success: true,
        message: 'ইনভেন্টরি স্টক সফলভাবে আপডেট করা হয়েছে',
        data: item,
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
