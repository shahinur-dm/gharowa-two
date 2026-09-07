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
      if (items && items.length > 0) {
        return NextResponse.json(
          { success: true, count: items.length, data: items },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB media fetch notice:', error.message);
  }

  const fallback = getStoreMediaItems();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.url) {
      return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 });
    }

    const mediaData = {
      _id: `m-${Date.now()}`,
      id: `m-${Date.now()}`,
      title: body.title ? body.title.trim() : 'Gharowa Asset',
      category: body.category || 'general',
      url: body.url.trim(),
      size: body.size || 'Uploaded Asset',
      addedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await MediaAsset.create(mediaData);
        addStoreMediaItem(mediaData);
        return NextResponse.json(
          { success: true, message: 'মিডিয়া সফলভাবে যোগ করা হয়েছে', data: saved },
          { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    } catch (dbErr: any) {
      console.warn('MongoDB media save fallback to store:', dbErr.message);
    }

    const savedFallback = addStoreMediaItem(mediaData);
    return NextResponse.json(
      { success: true, message: 'মিডিয়া সফলভাবে যোগ করা হয়েছে', data: savedFallback },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Failed to create media' }, { status: 500 });
  }
}
