import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MediaAsset } from '@/models/MediaAsset';
import { getStoreMediaItems, addStoreMediaItem } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const items = await MediaAsset.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json(
        { success: true, count: items.length, data: items },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB media fetch notice:', error.message);
  }

  const fallback = getStoreMediaItems();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.url) {
      return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 });
    }

    const mediaData = {
      title: body.title ? body.title.trim() : 'Gharowa Asset',
      category: body.category || 'general',
      url: body.url.trim(),
      size: body.size || 'Uploaded Asset',
      addedDate: new Date().toISOString().split('T')[0],
    };

    await connectToDatabase();

    const saved = await MediaAsset.create(mediaData);
    const savedObj = saved.toObject ? saved.toObject() : saved;

    addStoreMediaItem({
      ...savedObj,
      _id: String(savedObj._id),
    });

    return NextResponse.json(
      { success: true, message: 'মিডিয়া সফলভাবে যোগ করা হয়েছে', data: savedObj },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error saving media asset:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to create media' }, { status: 500 });
  }
}
