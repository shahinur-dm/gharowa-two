import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { updateStoreMenuItem } from '@/lib/serverStore';
import { invalidateMenuItemsCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    let currentItem = null;
    if (mongoose.isValidObjectId(id)) {
      currentItem = await MenuItem.findById(id);
    }
    if (!currentItem) {
      currentItem = await MenuItem.findOne({ $or: [{ slug: id }, { sku: id }] });
    }

    if (!currentItem) {
      return NextResponse.json({ success: false, message: 'Item not found in database' }, { status: 404 });
    }

    const newAvailability = !currentItem.isAvailable;
    currentItem.isAvailable = newAvailability;
    await currentItem.save();

    invalidateMenuItemsCache();
    updateStoreMenuItem(id, { isAvailable: newAvailability });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/menu');
    } catch (revalErr) {}

    return NextResponse.json({
      success: true,
      message: 'Availability toggled successfully',
      data: { _id: id, isAvailable: newAvailability },
    }, { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } });
  } catch (error: any) {
    console.error('Error toggling availability:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to toggle availability' }, { status: 500 });
  }
}
