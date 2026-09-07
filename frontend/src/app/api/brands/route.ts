import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { BrandPartner } from '@/models/BrandPartner';
import { getStoreBrandPartners } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const brands = await BrandPartner.find({ isActive: { $ne: false } })
        .sort({ displayOrder: 1, createdAt: 1 })
        .lean();

      if (brands) {
        return NextResponse.json(
          { success: true, count: brands.length, data: brands },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
          }
        );
      }
    }
  } catch (error: any) {
    console.warn('Database error in brands GET, fallback to store:', error.message);
  }

  const liveStoreBrands = getStoreBrandPartners().filter((b) => b.isActive !== false);
  return NextResponse.json(
    {
      success: true,
      count: liveStoreBrands.length,
      data: liveStoreBrands,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
