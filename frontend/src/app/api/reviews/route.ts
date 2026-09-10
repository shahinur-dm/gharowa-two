import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomerReview } from '@/models/CustomerReview';
import { getStoreCustomerReviews } from '@/lib/serverStore';
import { getCachedReviews, setCachedReviews } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cached = getCachedReviews();
  if (cached) {
    return NextResponse.json(
      { success: true, count: cached.length, data: cached },
      { headers: { 'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59' } }
    );
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const reviews = await CustomerReview.find({ isActive: { $ne: false } })
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      if (reviews) {
        setCachedReviews(reviews);
      }

      return NextResponse.json(
        { success: true, count: reviews.length, data: reviews },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
          },
        }
      );
    }
  } catch (error: any) {
    console.warn('Database error in reviews GET, fallback to store:', error.message);
  }

  const liveStoreReviews = getStoreCustomerReviews().filter((r) => r.isActive !== false);
  return NextResponse.json(
    {
      success: true,
      count: liveStoreReviews.length,
      data: liveStoreReviews,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
      },
    }
  );
}
