import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
        let updated = null;
        if (mongoose.isValidObjectId(id)) {
          updated = await BlogVideo.findByIdAndUpdate(id, body, { new: true }).lean();
        }
        if (!updated) {
          updated = await BlogVideo.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
        }
        if (updated) {
          updateStoreBlogVideo(id, body);
          return NextResponse.json({
            success: true,
            message: 'ভিডিও ব্লগ আপডেট সফল হয়েছে',
            data: updated,
          });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB blog update notice:', e.message);
    }

    const fallbackUpdated = updateStoreBlogVideo(id, body);
    return NextResponse.json({
      success: true,
      message: 'ভিডিও ব্লগ আপডেট সফল হয়েছে',
      data: fallbackUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update blog' },
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
        if (mongoose.isValidObjectId(id)) {
          await BlogVideo.findByIdAndDelete(id);
        } else {
          await BlogVideo.findOneAndDelete({ _id: id });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB blog delete notice:', e.message);
    }

    deleteStoreBlogVideo(id);

    return NextResponse.json({
      success: true,
      message: 'ভিডিও সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
