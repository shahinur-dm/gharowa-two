import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { updateStoreCategory, deleteStoreCategory } from '@/lib/serverStore';
import { invalidateCategoriesCache } from '@/lib/cacheManager';

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

    await connectToDatabase();

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

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Category not found in database' },
        { status: 404 }
      );
    }

    invalidateCategoriesCache();

    updateStoreCategory(id, {
      ...(updated as any),
      _id: String((updated as any)._id),
    });

    try {
      revalidatePath('/');
      revalidatePath('/menu');
    } catch (e) {}

    return NextResponse.json(
      { success: true, message: 'Category updated successfully', data: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error updating category:', error);
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
    await connectToDatabase();

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await MenuCategory.findByIdAndDelete(id);
    } else {
      deleted = await MenuCategory.findOneAndDelete({ $or: [{ _id: id }, { slug: id }] });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Category not found in database' },
        { status: 404 }
      );
    }

    invalidateCategoriesCache();
    deleteStoreCategory(id);

    try {
      revalidatePath('/');
      revalidatePath('/menu');
    } catch (e) {}

    return NextResponse.json(
      { success: true, message: 'Category deleted successfully' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Unable to delete category' },
      { status: 500 }
    );
  }
}
