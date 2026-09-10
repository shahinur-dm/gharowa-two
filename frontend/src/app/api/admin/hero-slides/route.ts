import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { getStoreHeroSlides, addStoreHeroSlide } from '@/lib/serverStore';
import { invalidateHeroSlidesCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const slides = await HeroSlide.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
      return NextResponse.json(
        { success: true, count: slides.length, data: slides },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB hero slides fetch notice:', error.message);
  }

  const fallback = getStoreHeroSlides();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.mainImageUrl && !body.videoUrl) {
      return NextResponse.json(
        { success: false, message: 'মূল হিরো ছবি বা ভিডিও লিঙ্ক আবশ্যক' },
        { status: 400 }
      );
    }

    const slideData: {
      title: string;
      titleBn: string;
      subtitleEn: string;
      subtitleBn: string;
      badgeText: string;
      badgeBn: string;
      mediaType: 'image' | 'video';
      mainImageUrl: string;
      videoUrl: string;
      supportingImageUrl: string;
      displayOrder: number;
      slideDurationSeconds: number;
      isActive: boolean;
    } = {
      title: body.title ? body.title.trim() : 'Gharowa Hero Dish',
      titleBn: body.titleBn ? body.titleBn.trim() : '',
      subtitleEn: body.subtitleEn ? body.subtitleEn.trim() : '',
      subtitleBn: body.subtitleBn ? body.subtitleBn.trim() : '',
      badgeText: body.badgeText ? body.badgeText.trim() : 'AUTHENTIC',
      badgeBn: body.badgeBn ? body.badgeBn.trim() : '',
      mediaType: body.mediaType === 'video' ? 'video' : 'image',
      mainImageUrl: body.mainImageUrl ? body.mainImageUrl.trim() : '',
      videoUrl: body.videoUrl ? body.videoUrl.trim() : '',
      supportingImageUrl: body.supportingImageUrl ? body.supportingImageUrl.trim() : '',
      displayOrder: Number(body.displayOrder) || 0,
      slideDurationSeconds: Number(body.slideDurationSeconds) || 4,
      isActive: body.isActive !== false,
    };

    await connectToDatabase();

    const saved = await HeroSlide.create(slideData);
    const savedObj = saved.toObject ? saved.toObject() : saved;

    invalidateHeroSlidesCache();

    addStoreHeroSlide({
      ...savedObj,
      _id: String(savedObj._id),
    });

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json(
      {
        success: true,
        message: 'হিরো স্লাইড সফলভাবে যোগ করা হয়েছে',
        data: savedObj,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error saving hero slide:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}
