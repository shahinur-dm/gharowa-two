import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { getStoreHeroSlides } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const slides = await HeroSlide.find({ isActive: { $ne: false } })
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean();

      if (slides) {
        return NextResponse.json(
          { success: true, count: slides.length, data: slides },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
          }
        );
      }
    }
  } catch (error: any) {
    console.warn('Database error in hero-slides GET, fallback to store:', error.message);
  }

  const liveStoreSlides = getStoreHeroSlides().filter((s) => s.isActive !== false);
  return NextResponse.json(
    {
      success: true,
      count: liveStoreSlides.length,
      data: liveStoreSlides,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
