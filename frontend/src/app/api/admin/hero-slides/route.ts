import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { getStoreHeroSlides, addStoreHeroSlide } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const slides = await HeroSlide.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
      if (slides && slides.length > 0) {
        return NextResponse.json(
          { success: true, count: slides.length, data: slides },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB hero slides fetch notice:', error.message);
  }

  const fallback = getStoreHeroSlides();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.mainImageUrl) {
      return NextResponse.json(
        { success: false, message: 'মূল হিরো ছবির লিঙ্ক (Main Image URL) আবশ্যক' },
        { status: 400 }
      );
    }

    const slideData = {
      _id: `slide-${Date.now()}`,
      title: body.title ? body.title.trim() : 'Gharowa Hero Dish',
      mainImageUrl: body.mainImageUrl.trim(),
      supportingImageUrl: body.supportingImageUrl ? body.supportingImageUrl.trim() : '',
      badgeText: body.badgeText ? body.badgeText.trim() : '1972',
      displayOrder: Number(body.displayOrder) || 0,
      slideDurationSeconds: Number(body.slideDurationSeconds) || 4,
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await HeroSlide.create(slideData);
        return NextResponse.json(
          {
            success: true,
            message: 'হিরো স্লাইড সফলভাবে যোগ করা হয়েছে',
            data: saved,
          },
          { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    } catch (dbErr: any) {
      console.warn('MongoDB hero slide save fallback to store:', dbErr.message);
    }

    const savedFallback = addStoreHeroSlide(slideData);
    return NextResponse.json(
      {
        success: true,
        message: 'হিরো স্লাইড সফলভাবে যোগ করা হয়েছে',
        data: savedFallback,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}
