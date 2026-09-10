import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { BrandPartner } from '@/models/BrandPartner';
import { updateStoreBrandPartner, deleteStoreBrandPartner } from '@/lib/serverStore';

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
      updated = await BrandPartner.findByIdAndUpdate(id, body, { new: true }).lean();
    }
    if (!updated) {
      updated = await BrandPartner.findOneAndUpdate({ _id: id }, body, { new: true }).lean();
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Brand partner not found in database' },
        { status: 404 }
      );
    }

    updateStoreBrandPartner(id, body);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'ব্র্যান্ড আপডেট সফল হয়েছে',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating brand partner:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update brand' },
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
      deleted = await BrandPartner.findByIdAndDelete(id);
    } else {
      deleted = await BrandPartner.findOneAndDelete({ _id: id });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Brand partner not found in database' },
        { status: 404 }
      );
    }

    deleteStoreBrandPartner(id);

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'ব্র্যান্ড সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    console.error('Error deleting brand partner:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
