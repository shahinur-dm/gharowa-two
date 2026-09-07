import { NextResponse } from 'next/server';
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

    try {
      const db = await connectToDatabase();
      if (db) {
        await MediaAsset.findOneAndDelete({ $or: [{ _id: id }, { id: id }] });
      }
    } catch (e: any) {
      console.warn('MongoDB media delete notice:', e.message);
    }

    deleteStoreMediaItem(id);

    return NextResponse.json({
      success: true,
      message: 'মিডিয়া সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
