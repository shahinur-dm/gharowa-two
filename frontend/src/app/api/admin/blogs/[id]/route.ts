import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BlogVideo } from '@/models/BlogVideo';
import { updateStoreBlogVideo, deleteStoreBlogVideo } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    try {
      const db = await connectToDatabase();
      if (db) {
        const updated = await BlogVideo.findByIdAndUpdate(id, body, { new: true }).lean();
        if (updated) {
          updateStoreBlogVideo(id, body);
          return NextResponse.json({
            success: true,
            message: 'ভিডিও আপডেট সফল হয়েছে',
            data: updated,
          });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB blog video update fallback:', e.message);
    }

    const fallbackUpdated = updateStoreBlogVideo(id, body);
    return NextResponse.json({
      success: true,
      message: 'ভিডিও আপডেট সফল হয়েছে',
      data: fallbackUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    try {
      const db = await connectToDatabase();
      if (db) {
        await BlogVideo.findByIdAndDelete(id);
      }
    } catch (e: any) {
      console.warn('MongoDB blog video delete notice:', e.message);
    }

    deleteStoreBlogVideo(id);

    return NextResponse.json({
      success: true,
      message: 'ভিডিও সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
