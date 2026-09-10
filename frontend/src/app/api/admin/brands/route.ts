import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
      return NextResponse.json(
        { success: true, count: brands.length, data: brands },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB brands fetch notice:', error.message);
  }

  const fallback = getStoreBrandPartners();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
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

    await connectToDatabase();

    const saved = await BrandPartner.create(brandData);
    const savedObj = saved.toObject ? saved.toObject() : saved;
    addStoreBrandPartner({
      ...savedObj,
      _id: String(savedObj._id),
    });

    try {
      revalidatePath('/');
    } catch (e) {}

    return NextResponse.json(
      {
        success: true,
        message: 'ব্র্যান্ড পার্টনার সফলভাবে যোগ করা হয়েছে',
        data: savedObj,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    console.error('Error saving brand partner:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create brand partner' },
      { status: 500 }
    );
  }
}
