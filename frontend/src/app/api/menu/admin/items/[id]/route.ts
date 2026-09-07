import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { MenuCategory } from '@/models/MenuCategory';
import { updateStoreMenuItem, deleteStoreMenuItem, getStoreMenuItems } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updates = {
      ...body,
      price: body.price !== undefined ? Number(body.price) : undefined,
      originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) : undefined,
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
      preparationTimeMinutes: body.preparationTimeMinutes !== undefined ? Number(body.preparationTimeMinutes) : undefined,
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        let categoryId = body.category;
        if (typeof categoryId === 'string' && !categoryId.match(/^[0-9a-fA-F]{24}$/)) {
          const catDoc = await MenuCategory.findOne({ slug: categoryId });
          if (catDoc) categoryId = catDoc._id;
        }

        const updated = await MenuItem.findByIdAndUpdate(
          id,
          { ...updates, category: categoryId || body.category },
          { new: true }
        )
          .populate('category')
          .lean();

        if (updated) {
          return NextResponse.json(
            { success: true, message: 'Food item updated successfully', data: updated },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB item update notice:', e.message);
    }

    const fallbackUpdated = updateStoreMenuItem(id, updates);
    return NextResponse.json(
      { success: true, message: 'Food item updated successfully', data: fallbackUpdated || updates },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to update item right now' },
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
        await MenuItem.findByIdAndDelete(id);
      }
    } catch (e: any) {
      console.warn('MongoDB item delete notice:', e.message);
    }

    deleteStoreMenuItem(id);
    return NextResponse.json(
      { success: true, message: 'Food item deleted successfully' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to delete item' },
      { status: 500 }
    );
  }
}
