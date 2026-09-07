import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { HeroSlide } from '@/models/HeroSlide';
import { updateStoreHeroSlide, deleteStoreHeroSlide } from '@/lib/serverStore';

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
          updated = await HeroSlide.findByIdAndUpdate(id, body, { new: true }).lean();
        }
        if (!updated) {
          updated = await HeroSlide.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
        }
        if (updated) {
          updateStoreHeroSlide(id, body);
          return NextResponse.json({
            success: true,
            message: 'হিরো স্লাইড আপডেট সফল হয়েছে',
            data: updated,
          });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB hero slide update notice:', e.message);
    }

    const fallbackUpdated = updateStoreHeroSlide(id, body);
    return NextResponse.json({
      success: true,
      message: 'হিরো স্লাইড আপডেট সফল হয়েছে',
      data: fallbackUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update hero slide' },
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
          await HeroSlide.findByIdAndDelete(id);
        } else {
          await HeroSlide.findOneAndDelete({ _id: id });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB hero slide delete notice:', e.message);
    }

    deleteStoreHeroSlide(id);

    return NextResponse.json({
      success: true,
      message: 'হিরো স্লাইড সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}
