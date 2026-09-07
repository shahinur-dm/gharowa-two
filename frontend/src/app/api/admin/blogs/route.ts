import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogVideo } from '@/models/BlogVideo';
import { getStoreBlogVideos, addStoreBlogVideo } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const videos = await BlogVideo.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
      if (videos && videos.length > 0) {
        return NextResponse.json(
          { success: true, count: videos.length, data: videos },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB blogs fetch notice:', error.message);
  }

  const fallback = getStoreBlogVideos();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.videoUrl || !body.thumbnailUrl) {
      return NextResponse.json(
        { success: false, message: 'Video URL এবং Thumbnail URL উভয়ই প্রয়োজন' },
        { status: 400 }
      );
    }

    const videoData = {
      _id: `vid-${Date.now()}`,
      title: body.title || 'Gharowa Food Vlog Review',
      titleBn: body.titleBn || '',
      videoUrl: body.videoUrl.trim(),
      thumbnailUrl: body.thumbnailUrl.trim(),
      duration: body.duration || '03:45',
      authorName: body.authorName || 'Gharowa Kitchen',
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await BlogVideo.create(videoData);
        return NextResponse.json(
          {
            success: true,
            message: 'ভিডিও ব্লগ সফলভাবে যোগ করা হয়েছে',
            data: saved,
          },
          { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    } catch (dbErr: any) {
      console.warn('MongoDB save fallback to store:', dbErr.message);
    }

    const savedFallback = addStoreBlogVideo(videoData);
    return NextResponse.json(
      {
        success: true,
        message: 'ভিডিও ব্লগ সফলভাবে যোগ করা হয়েছে',
        data: savedFallback,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create blog video' },
      { status: 500 }
    );
  }
}
