import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { updateStoreCategory, deleteStoreCategory } from '@/lib/serverStore';

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
    if (body.displayOrder !== undefined) updates.displayOrder = Number(body.displayOrder);

    try {
      const db = await connectToDatabase();
      if (db) {
        let updated = null;
        if (mongoose.isValidObjectId(id)) {
          updated = await MenuCategory.findByIdAndUpdate(id, updates, { new: true }).lean();
        }
        if (!updated) {
          updated = await MenuCategory.findOneAndUpdate(
            { $or: [{ _id: id }, { slug: id }] },
            updates,
            { new: true }
          ).lean();
        }

        if (updated) {
          updateStoreCategory(id, {
            ...(updated as any),
            _id: String((updated as any)._id),
          });
          return NextResponse.json(
            { success: true, message: 'Category updated successfully', data: updated },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB category update notice:', e.message);
    }

    const fallbackUpdated = updateStoreCategory(id, updates);
    return NextResponse.json(
      { success: true, message: 'Category updated successfully', data: fallbackUpdated || updates },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Unable to update category' },
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
          await MenuCategory.findByIdAndDelete(id);
        } else {
          await MenuCategory.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB category delete notice:', e.message);
    }

    deleteStoreCategory(id);
    return NextResponse.json(
      { success: true, message: 'Category deleted successfully' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Unable to delete category' },
      { status: 500 }
    );
  }
}
