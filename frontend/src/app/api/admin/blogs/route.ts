import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
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
      return NextResponse.json(
        { success: true, count: videos.length, data: videos },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB blogs fetch notice:', error.message);
  }

  const fallback = getStoreBlogVideos();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
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
      title: body.title || 'Gharowa Food Vlog Review',
      titleBn: body.titleBn || '',
      videoUrl: body.videoUrl.trim(),
      thumbnailUrl: body.thumbnailUrl.trim(),
      duration: body.duration || '03:45',
      authorName: body.authorName || 'Gharowa Kitchen',
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== false,
    };

    await connectToDatabase();

    const saved = await BlogVideo.create(videoData);
    const savedObj = saved.toObject ? saved.toObject() : saved;
    addStoreBlogVideo({
      ...savedObj,
      _id: String(savedObj._id),
    });

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json(
      {
        success: true,
        message: 'ভিডিও ব্লগ সফলভাবে যোগ করা হয়েছে',
        data: savedObj,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error saving blog video:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create blog video' },
      { status: 500 }
    );
  }
}
