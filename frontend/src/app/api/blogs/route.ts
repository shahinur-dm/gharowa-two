import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogVideo } from '@/models/BlogVideo';
import { getStoreBlogVideos } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const videos = await BlogVideo.find({ isActive: { $ne: false } })
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();

      return NextResponse.json(
        { success: true, count: videos.length, data: videos },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          },
        }
      );
    }
  } catch (error: any) {
    console.warn('Database error in blogs GET, fallback to store:', error.message);
  }

  const liveStoreVideos = getStoreBlogVideos().filter((v) => v.isActive !== false);
  return NextResponse.json(
    {
      success: true,
      count: liveStoreVideos.length,
      data: liveStoreVideos,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      },
    }
  );
}
