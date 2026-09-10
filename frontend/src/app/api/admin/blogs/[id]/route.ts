import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    await connectToDatabase();

    let updated = null;
    if (mongoose.isValidObjectId(id)) {
      updated = await BlogVideo.findByIdAndUpdate(id, body, { new: true }).lean();
    }
    if (!updated) {
      updated = await BlogVideo.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Blog video not found in database' },
        { status: 404 }
      );
    }

    updateStoreBlogVideo(id, body);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'ভিডিও ব্লগ আপডেট সফল হয়েছে',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update blog' },
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

    await connectToDatabase();

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await BlogVideo.findByIdAndDelete(id);
    } else {
      deleted = await BlogVideo.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Blog video not found in database' },
        { status: 404 }
      );
    }

    deleteStoreBlogVideo(id);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'ভিডিও সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
