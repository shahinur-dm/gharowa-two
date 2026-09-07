import { NextResponse } from 'next/server';
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

    try {
      const db = await connectToDatabase();
      if (db) {
        const updated = await BrandPartner.findByIdAndUpdate(id, body, { new: true }).lean();
        if (updated) {
          updateStoreBrandPartner(id, body);
          return NextResponse.json({
            success: true,
            message: 'ব্র্যান্ড তথ্য আপডেট সফল হয়েছে',
            data: updated,
          });
        }
      }
    } catch (e: any) {
      console.warn('MongoDB brand update fallback:', e.message);
    }

    const fallbackUpdated = updateStoreBrandPartner(id, body);
    return NextResponse.json({
      success: true,
      message: 'ব্র্যান্ড তথ্য আপডেট সফল হয়েছে',
      data: fallbackUpdated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update brand' },
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
        await BrandPartner.findByIdAndDelete(id);
      }
    } catch (e: any) {
      console.warn('MongoDB brand delete notice:', e.message);
    }

    deleteStoreBrandPartner(id);

    return NextResponse.json({
      success: true,
      message: 'ব্র্যান্ড সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete brand' },
      { status: 500 }
    );
  }
}
