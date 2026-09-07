import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomerReview } from '@/models/CustomerReview';
import { getStoreCustomerReviews, addStoreCustomerReview } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const reviews = await CustomerReview.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
      if (reviews) {
        return NextResponse.json(
          { success: true, count: reviews.length, data: reviews },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB reviews fetch notice:', error.message);
  }

  const fallback = getStoreCustomerReviews();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
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

    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await CustomerReview.create(reviewData);
        if (saved) {
          const savedObj = saved.toObject ? saved.toObject() : saved;
          addStoreCustomerReview({
            ...savedObj,
            _id: String(savedObj._id),
          });
          return NextResponse.json(
            {
              success: true,
              message: 'রিভিউ সফলভাবে যোগ করা হয়েছে',
              data: savedObj,
            },
            { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB review save notice:', dbErr.message);
    }

    const fallbackData = {
      ...reviewData,
      _id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const savedFallback = addStoreCustomerReview(fallbackData);
    return NextResponse.json(
      {
        success: true,
        message: 'রিভিউ সফলভাবে যোগ করা হয়েছে',
        data: savedFallback,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create customer review' },
      { status: 500 }
    );
  }
}
