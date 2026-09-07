import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { MenuCategory } from '@/models/MenuCategory';
import { getStoreMenuItems, addStoreMenuItem, MenuItemData } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const items = await MenuItem.find().populate('category').sort({ displayOrder: 1 }).lean();
      if (items && items.length > 0) {
        return NextResponse.json(
          { success: true, count: items.length, data: items },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB items fetch fallback:', error.message);
  }

  const items = getStoreMenuItems();
  return NextResponse.json(
    { success: true, count: items.length, data: items },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nameBn || !body.nameEn || !body.price) {
      return NextResponse.json(
        { success: false, message: 'খাবারের নাম ও মূল্য আবশ্যক' },
        { status: 400 }
      );
    }

    const newItemData: MenuItemData = {
      _id: `item-${Date.now()}`,
      nameBn: body.nameBn,
      nameEn: body.nameEn,
      slug: body.slug || body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: body.sku || `GH-${Date.now().toString().slice(-4)}`,
      category: body.category || 'khichuri-biryani',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      descriptionBn: body.descriptionBn || '',
      descriptionEn: body.descriptionEn || '',
      image: body.image || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      galleryImages: body.galleryImages || [],
      spiceLevel: Number(body.spiceLevel) || 1,
      isAvailable: body.isAvailable !== false,
      isBestseller: !!body.isBestseller,
      isFeatured: !!body.isFeatured,
      isPopular: !!body.isPopular,
      preparationTimeMinutes: Number(body.preparationTimeMinutes) || 15,
      servingSize: body.servingSize || '১ জন (1 Person)',
      ingredients: body.ingredients || [],
      dietaryTags: body.dietaryTags || [],
      displayOrder: Number(body.displayOrder) || 1,
      rating: 4.9,
      reviewsCount: 30,
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        let catId = body.category;
        if (typeof catId === 'string' && !catId.match(/^[0-9a-fA-F]{24}$/)) {
          const catDoc = await MenuCategory.findOne({ slug: catId });
          if (catDoc) catId = catDoc._id;
        }

        const saved = await MenuItem.create({ ...newItemData, category: catId || body.category });
        const populated = await MenuItem.findById(saved._id).populate('category').lean();
        return NextResponse.json(
          { success: true, message: 'খাবার সফলভাবে তৈরি হয়েছে', data: populated },
          { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    } catch (e: any) {
      console.warn('MongoDB item create notice:', e.message);
    }

    const savedFallback = addStoreMenuItem(newItemData);
    return NextResponse.json(
      { success: true, message: 'খাবার সফলভাবে তৈরি হয়েছে', data: savedFallback },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to save food item right now' },
      { status: 500 }
    );
  }
}
