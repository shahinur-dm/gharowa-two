import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    await connectToDatabase();

    let updated = null;
    if (mongoose.isValidObjectId(id)) {
      updated = await HeroSlide.findByIdAndUpdate(id, body, { new: true }).lean();
    }
    if (!updated) {
      updated = await HeroSlide.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Hero slide not found in database' },
        { status: 404 }
      );
    }

    updateStoreHeroSlide(id, body);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'হিরো স্লাইড আপডেট সফল হয়েছে',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update hero slide' },
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
      deleted = await HeroSlide.findByIdAndDelete(id);
    } else {
      deleted = await HeroSlide.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Hero slide not found in database' },
        { status: 404 }
      );
    }

    deleteStoreHeroSlide(id);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'হিরো স্লাইড সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}
