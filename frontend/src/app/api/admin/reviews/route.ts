import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomerReview } from '@/models/CustomerReview';
import { getStoreCustomerReviews, addStoreCustomerReview } from '@/lib/serverStore';
import { invalidateReviewsCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const reviews = await CustomerReview.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
      return NextResponse.json(
        { success: true, count: reviews.length, data: reviews },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB reviews fetch notice:', error.message);
  }

  const fallback = getStoreCustomerReviews();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.reviewText) {
      return NextResponse.json(
        { success: false, message: 'গ্রাহকের নাম এবং রিভিউ টেক্সট প্রয়োজন' },
        { status: 400 }
      );
    }

    const reviewData = {
      customerName: body.customerName.trim(),
      avatarUrl: body.avatarUrl ? body.avatarUrl.trim() : '',
      rating: Number(body.rating) || 5,
      reviewText: body.reviewText.trim(),
      reviewDateText: body.reviewDateText ? body.reviewDateText.trim() : '1 year ago',
      platform: body.platform || 'google',
      isVerified: body.isVerified !== false,
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== false,
    };

    await connectToDatabase();

    const saved = await CustomerReview.create(reviewData);
    const savedObj = saved.toObject ? saved.toObject() : saved;

    invalidateReviewsCache();

    addStoreCustomerReview({
      ...savedObj,
      _id: String(savedObj._id),
    });

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json(
      {
        success: true,
        message: 'রিভিউ সফলভাবে যোগ করা হয়েছে',
        data: savedObj,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error creating customer review:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create customer review' },
      { status: 500 }
    );
  }
}
