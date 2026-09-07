import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { getStoreCategories, addStoreCategory } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const categories = await MenuCategory.find().sort({ displayOrder: 1 }).lean();
      if (categories && categories.length > 0) {
        return NextResponse.json(
          { success: true, count: categories.length, data: categories },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB category fetch fallback:', error.message);
  }

  const fallback = getStoreCategories();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nameBn || !body.nameEn) {
      return NextResponse.json(
        { success: false, message: 'বাংলা ও ইংরেজি ক্যাটাগরির নাম প্রয়োজন' },
        { status: 400 }
      );
    }

    const categoryData = {
      _id: `cat-${Date.now()}`,
      nameBn: body.nameBn,
      nameEn: body.nameEn,
      slug: body.slug || body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      descriptionBn: body.descriptionBn || '',
      descriptionEn: body.descriptionEn || '',
      image: body.image || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      icon: body.icon || 'Utensils',
      displayOrder: Number(body.displayOrder) || 1,
      isActive: body.isActive !== false,
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        const saved = await MenuCategory.create(categoryData);
        return NextResponse.json(
          {
            success: true,
            message: 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে',
            data: saved,
          },
          { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    } catch (dbErr: any) {
      console.warn('MongoDB save fallback to server store:', dbErr.message);
    }

    const savedFallback = addStoreCategory(categoryData);
    return NextResponse.json(
      {
        success: true,
        message: 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে',
        data: savedFallback,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to save category right now. Please try again.' },
      { status: 500 }
    );
  }
}
