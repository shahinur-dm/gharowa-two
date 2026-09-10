import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { getStoreMenuItems, updateStoreMenuItem } from '@/lib/serverStore';
import { invalidateMenuItemsCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let newAvailability = false;

    try {
      const db = await connectToDatabase();
      if (db) {
        let currentItem = null;
        if (mongoose.isValidObjectId(id)) {
          currentItem = await MenuItem.findById(id);
        }
        if (!currentItem) {
          currentItem = await MenuItem.findOne({ $or: [{ slug: id }, { sku: id }] });
        }

        if (currentItem) {
          newAvailability = !currentItem.isAvailable;
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
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB availability toggle notice:', dbErr.message);
    }

    const item = getStoreMenuItems().find((i) => i._id === id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    newAvailability = !item.isAvailable;
    const updated = updateStoreMenuItem(id, { isAvailable: newAvailability });
    invalidateMenuItemsCache();

    return NextResponse.json({
      success: true,
      message: 'Availability toggled',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
