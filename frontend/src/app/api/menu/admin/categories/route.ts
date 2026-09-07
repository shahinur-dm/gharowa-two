import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuCategory } from '@/models/MenuCategory';
import { getStoreCategories, addStoreCategory } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const categories = await MenuCategory.find().sort({ displayOrder: 1, createdAt: 1 }).lean();
      if (categories && categories.length > 0) {
        return NextResponse.json(
          { success: true, count: categories.length, data: categories },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB category fetch fallback:', error.message);
  }

  const fallback = getStoreCategories();
  return NextResponse.json(
    { success: true, count: fallback.length, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
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

    const baseSlug = (body.slug || body.nameEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanSlug = baseSlug || `cat-${Date.now()}`;

    try {
      const db = await connectToDatabase();
      if (db) {
        let finalSlug = cleanSlug;
        const existingCat = await MenuCategory.findOne({ slug: finalSlug });
        if (existingCat) {
          finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
        }

        const categoryData = {
          nameBn: body.nameBn.trim(),
          nameEn: body.nameEn.trim(),
          slug: finalSlug,
          descriptionBn: body.descriptionBn || '',
          descriptionEn: body.descriptionEn || '',
          image: body.image || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
          icon: body.icon || 'Utensils',
          displayOrder: Number(body.displayOrder) || 1,
          isActive: body.isActive !== false,
        };

        const saved = await MenuCategory.create(categoryData);
        const savedObj = saved.toObject ? saved.toObject() : saved;

        addStoreCategory({
          ...(savedObj as any),
          _id: String(savedObj._id),
        });

        return NextResponse.json(
          {
            success: true,
            message: 'ক্যাটাগরি সফলভাবে তৈরি ও সংরক্ষণ করা হয়েছে',
            data: savedObj,
          },
          { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
        );
      }
    } catch (dbErr: any) {
      console.warn('MongoDB save category notice:', dbErr.message);
    }

    const fallbackData = {
      _id: `cat-${Date.now()}`,
      nameBn: body.nameBn,
      nameEn: body.nameEn,
      slug: cleanSlug,
      descriptionBn: body.descriptionBn || '',
      descriptionEn: body.descriptionEn || '',
      image: body.image || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      icon: body.icon || 'Utensils',
      displayOrder: Number(body.displayOrder) || 1,
      isActive: body.isActive !== false,
    };

    const savedFallback = addStoreCategory(fallbackData);
    return NextResponse.json(
      {
        success: true,
        message: 'ক্যাটাগরি সফলভাবে তৈরি হয়েছে',
        data: savedFallback,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Unable to save category right now. Please try again.' },
      { status: 500 }
    );
  }
}
