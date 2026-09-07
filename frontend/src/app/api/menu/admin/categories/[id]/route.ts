import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { updateStoreCategory, deleteStoreCategory, getStoreCategories } from '@/lib/serverStore';

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
      displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : undefined,
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        const updated = await MenuCategory.findByIdAndUpdate(id, updates, { new: true }).lean();
        if (updated) {
          return NextResponse.json(
            { success: true, message: 'Category updated successfully', data: updated },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB category update notice:', e.message);
    }

    const fallbackUpdated = updateStoreCategory(id, updates);
    return NextResponse.json(
      { success: true, message: 'Category updated successfully', data: fallbackUpdated || updates },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to update category' },
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
        await MenuCategory.findByIdAndDelete(id);
      }
    } catch (e: any) {
      console.warn('MongoDB category delete notice:', e.message);
    }

    deleteStoreCategory(id);
    return NextResponse.json(
      { success: true, message: 'Category deleted successfully' },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to delete category' },
      { status: 500 }
    );
  }
}
