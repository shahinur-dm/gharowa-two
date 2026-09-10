import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MediaAsset } from '@/models/MediaAsset';
import { deleteStoreMediaItem } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectToDatabase();

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await MediaAsset.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await MediaAsset.findOneAndDelete({ $or: [{ _id: id }, { id: id }] });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Media asset not found in database' },
        { status: 404 }
      );
    }

    deleteStoreMediaItem(id);

    return NextResponse.json({
      success: true,
      message: 'মিডিয়া সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    console.error('Error deleting media asset:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete media' },
      { status: 500 }
    );
  }
}
