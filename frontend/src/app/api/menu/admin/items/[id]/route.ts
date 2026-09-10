import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { MenuCategory } from '@/models/MenuCategory';
import { updateStoreMenuItem, deleteStoreMenuItem } from '@/lib/serverStore';
import { invalidateMenuItemsCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates: any = {
      ...body,
    };
    if (body.price !== undefined) updates.price = Number(body.price);
    if (body.originalPrice !== undefined) updates.originalPrice = Number(body.originalPrice);
    if (body.displayOrder !== undefined) updates.displayOrder = Number(body.displayOrder);
    if (body.preparationTimeMinutes !== undefined) updates.preparationTimeMinutes = Number(body.preparationTimeMinutes);
    if (body.spiceLevel !== undefined) updates.spiceLevel = Number(body.spiceLevel);
    if (body.ingredients !== undefined) {
      updates.ingredients = Array.isArray(body.ingredients) ? body.ingredients : (body.ingredients ? [body.ingredients] : []);
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        let categoryId = body.category;
        if (categoryId) {
          if (typeof categoryId === 'string' && !mongoose.isValidObjectId(categoryId)) {
            const catDoc = await MenuCategory.findOne({ slug: categoryId });
            if (catDoc) categoryId = catDoc._id;
          }
          updates.category = categoryId;
        }

        let updated = null;
        if (mongoose.isValidObjectId(id)) {
          updated = await MenuItem.findByIdAndUpdate(id, updates, { new: true })
            .populate('category')
            .lean();
        }
        if (!updated) {
          updated = await MenuItem.findOneAndUpdate(
            { $or: [{ slug: id }, { sku: id }] },
            updates,
            { new: true }
          )
            .populate('category')
            .lean();
        }

        if (updated) {
          invalidateMenuItemsCache();
          updateStoreMenuItem(id, {
            ...(updated as any),
            _id: String((updated as any)._id),
          });
          try {
            revalidatePath('/');
            revalidatePath('/menu');
          } catch (revalErr) {}
          return NextResponse.json(
            { success: true, message: 'Food item updated successfully', data: updated },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
          );
        }
      }
    } catch (e: any) {
      console.error('MongoDB item update error:', e.message);
      return NextResponse.json(
        { success: false, message: e.message || 'ডাটাবেজে খাবার আপডেট করা সম্ভব হয়নি' },
        { status: 500 }
      );
    }

    invalidateMenuItemsCache();
    const fallbackUpdated = updateStoreMenuItem(id, updates);
    return NextResponse.json(
      { success: true, message: 'Food item updated successfully', data: fallbackUpdated || updates },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Unable to update item right now' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    try {
      const db = await connectToDatabase();
      if (db) {
        if (mongoose.isValidObjectId(id)) {
          await MenuItem.findByIdAndDelete(id);
        } else {
          await MenuItem.findOneAndDelete({ $or: [{ slug: id }, { sku: id }] });
        }
        invalidateMenuItemsCache();
        deleteStoreMenuItem(id);
        try {
          revalidatePath('/');
          revalidatePath('/menu');
        } catch (revalErr) {}
        return NextResponse.json(
          { success: true, message: 'Food item deleted successfully' },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
        );
      }
    } catch (e: any) {
      console.error('MongoDB item delete error:', e.message);
      return NextResponse.json(
        { success: false, message: e.message || 'ডাটাবেজ থেকে খাবার ডিলিট করা সম্ভব হয়নি' },
        { status: 500 }
      );
    }

    deleteStoreMenuItem(id);
    return NextResponse.json(
      { success: true, message: 'Food item deleted successfully' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to delete item' },
      { status: 500 }
    );
  }
}
