import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { getStoreCategories } from '@/lib/serverStore';
import { getCachedCategories, setCachedCategories } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cached = getCachedCategories();
  if (cached) {
    return NextResponse.json(
      { success: true, count: cached.length, data: cached },
      { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59' } }
    );
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const categories = await MenuCategory.find({ isActive: { $ne: false } })
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean();

      if (categories) {
        setCachedCategories(categories);
      }

      return NextResponse.json(
        { success: true, count: categories.length, data: categories },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
          },
        }
      );
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
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    }
  );
}
