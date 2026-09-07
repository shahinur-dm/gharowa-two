import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { MenuCategory } from '@/models/MenuCategory';
import { updateStoreMenuItem, deleteStoreMenuItem } from '@/lib/serverStore';

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
            { $or: [{ _id: id }, { slug: id }, { sku: id }] },
            updates,
            { new: true }
          )
            .populate('category')
            .lean();
        }

        if (updated) {
          updateStoreMenuItem(id, {
            ...(updated as any),
            _id: String((updated as any)._id),
          });
          return NextResponse.json(
            { success: true, message: 'Food item updated successfully', data: updated },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB item update notice:', e.message);
    }

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
          await MenuItem.findOneAndDelete({ $or: [{ _id: id }, { slug: id }, { sku: id }] });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB item delete notice:', e.message);
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
