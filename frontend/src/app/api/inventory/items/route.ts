import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { InventoryItem } from '@/models/InventoryItem';
import { ensureDatabaseBootstrapped } from '@/lib/dbBootstrap';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await ensureDatabaseBootstrapped();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const items = await InventoryItem.find().sort({ nameBn: 1 }).lean();
    const lowStockCount = items.filter((i) => i.currentStock <= i.minThreshold).length;

    return NextResponse.json(
      {
        success: true,
        count: items.length,
        lowStockCount,
        data: items,
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nameBn || !body.nameEn) {
      return NextResponse.json(
        { success: false, message: 'পণ্যের নাম আবশ্যক' },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ success: false, message: 'Database connection failed' }, { status: 500 });
    }

    const newItem = await InventoryItem.create({
      nameBn: body.nameBn.trim(),
      nameEn: body.nameEn.trim(),
      category: body.category || 'General',
      currentStock: Number(body.currentStock) || 0,
      minThreshold: Number(body.minThreshold) || 10,
      unit: body.unit || 'কেজি (kg)',
      costPerUnit: Number(body.costPerUnit) || 0,
      lastRestocked: body.lastRestocked || new Date().toISOString().split('T')[0],
    });

    return NextResponse.json(
      { success: true, message: 'ইনভেন্টরি আইটেম সফলভাবে যোগ করা হয়েছে', data: newItem },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
