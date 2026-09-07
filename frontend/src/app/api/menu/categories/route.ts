import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { getStoreCategories } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const categories = await MenuCategory.find({ isActive: { $ne: false } })
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean();

      if (categories && categories.length > 0) {
        return NextResponse.json(
          { success: true, count: categories.length, data: categories },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            },
          }
        );
      }
    }
  } catch (error: any) {
    console.warn('Database error in categories GET, fallback to store:', error.message);
  }

  const liveStoreCats = getStoreCategories().filter((c) => c.isActive !== false);
  return NextResponse.json(
    {
      success: true,
      count: liveStoreCats.length,
      data: liveStoreCats,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    }
  );
}
