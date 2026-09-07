import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { BrandPartner } from '@/models/BrandPartner';
import { getStoreBrandPartners, addStoreBrandPartner } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const brands = await BrandPartner.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
      if (brands) {
        return NextResponse.json(
          { success: true, count: brands.length, data: brands },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB brands fetch notice:', error.message);
  }

  const fallback = getStoreBrandPartners();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.logoUrl) {
      return NextResponse.json(
        { success: false, message: 'ব্র্যান্ড নাম এবং লোগো লিঙ্ক উভয়ই প্রয়োজন' },
        { status: 400 }
      );
    }

    const brandData = {
      name: body.name.trim(),
      logoUrl: body.logoUrl.trim(),
      websiteUrl: body.websiteUrl ? body.websiteUrl.trim() : '',
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== false,
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await BrandPartner.create(brandData);
        if (saved) {
          const savedObj = saved.toObject ? saved.toObject() : saved;
          addStoreBrandPartner({
            ...savedObj,
            _id: String(savedObj._id),
          });
          return NextResponse.json(
            {
              success: true,
              message: 'ব্র্যান্ড পার্টনার সফলভাবে যোগ করা হয়েছে',
              data: savedObj,
            },
            { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB brand save notice:', dbErr.message);
    }

    const fallbackData = {
      ...brandData,
      _id: `brand-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const savedFallback = addStoreBrandPartner(fallbackData);
    return NextResponse.json(
      {
        success: true,
        message: 'ব্র্যান্ড পার্টনার সফলভাবে যোগ করা হয়েছে',
        data: savedFallback,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create brand partner' },
      { status: 500 }
    );
  }
}
