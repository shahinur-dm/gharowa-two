import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
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
      const items = await MenuItem.find().populate('category').sort({ displayOrder: 1, createdAt: -1 }).lean();
      return NextResponse.json(
        { success: true, count: items.length, data: items || [] },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
      );
    }
  } catch (error: any) {
    console.warn('MongoDB items fetch fallback:', error.message);
  }

  const items = getStoreMenuItems();
  return NextResponse.json(
    { success: true, count: items.length, data: items },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
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

    const baseSlug = (body.slug || body.nameEn).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanSlug = baseSlug || `item-${Date.now()}`;

    let resolvedCategoryId: any = null;

    try {
      const db = await connectToDatabase();
      if (db) {
        // Resolve category safely without triggering Mongoose CastError on invalid ObjectIds
        if (body.category) {
          if (mongoose.isValidObjectId(body.category)) {
            const catDoc = await MenuCategory.findById(body.category);
            if (catDoc) resolvedCategoryId = catDoc._id;
          }
          if (!resolvedCategoryId) {
            const categorySlugOrName = String(body.category).replace(/^cat-/, '');
            const catDoc = await MenuCategory.findOne({
              $or: [
                { slug: body.category },
                { slug: categorySlugOrName },
                { nameEn: body.category },
                { nameBn: body.category },
              ],
            });
            if (catDoc) resolvedCategoryId = catDoc._id;
          }
        }

        // If still no category, find first available category or create default
        if (!resolvedCategoryId) {
          let firstCat = await MenuCategory.findOne().sort({ displayOrder: 1 });
          if (!firstCat) {
            firstCat = await MenuCategory.create({
              nameBn: 'খিচুড়ি ও বিরিয়ানি',
              nameEn: 'Khichuri & Biryani',
              slug: 'khichuri-biryani',
              displayOrder: 1,
              isActive: true,
            });
          }
          resolvedCategoryId = firstCat._id;
        }

        // Ensure unique slug
        let finalSlug = cleanSlug;
        const existingSlug = await MenuItem.findOne({ slug: finalSlug });
        if (existingSlug) {
          finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
        }

        const ingredientsArr = Array.isArray(body.ingredients)
          ? body.ingredients
          : typeof body.ingredients === 'string' && body.ingredients.trim()
          ? body.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];

        const createData = {
          nameBn: body.nameBn.trim(),
          nameEn: body.nameEn.trim(),
          slug: finalSlug,
          sku: body.sku || `GH-${Date.now().toString().slice(-4)}`,
          category: resolvedCategoryId,
          price: Number(body.price),
          originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
          descriptionBn: body.descriptionBn || '',
          descriptionEn: body.descriptionEn || '',
          image: body.image || 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
          galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [],
          spiceLevel: Number(body.spiceLevel) || 1,
          isAvailable: body.isAvailable !== false,
          isBestseller: !!body.isBestseller,
          isFeatured: !!body.isFeatured,
          isPopular: !!body.isPopular,
          preparationTimeMinutes: Number(body.preparationTimeMinutes) || 15,
          servingSize: body.servingSize || '১ জন (1 Person)',
          ingredients: ingredientsArr,
          dietaryTags: Array.isArray(body.dietaryTags) ? body.dietaryTags : [],
          displayOrder: Number(body.displayOrder) || 1,
          rating: Number(body.rating) || 4.9,
          reviewsCount: Number(body.reviewsCount) || 30,
        };

        const saved = await MenuItem.create(createData);
        const populated = await MenuItem.findById(saved._id).populate('category').lean();

        if (populated) {
          addStoreMenuItem({
            ...(populated as any),
            _id: String(populated._id),
          });

          try {
            revalidatePath('/', 'layout');
            revalidatePath('/');
            revalidatePath('/menu');
          } catch (revalErr) {}

          return NextResponse.json(
            { success: true, message: 'খাবার সফলভাবে তৈরি ও সংরক্ষণ করা হয়েছে', data: populated },
            { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
          );
        }
      }
    } catch (e: any) {
      console.error('MongoDB item create error:', e.message);
      return NextResponse.json(
        { success: false, message: e.message || 'ডাটাবেজে খাবার সংরক্ষণ করা সম্ভব হয়নি' },
        { status: 500 }
      );
    }

    // Fallback store if no DB connection configured
    const fallbackItem: MenuItemData = {
      _id: `item-${Date.now()}`,
      nameBn: body.nameBn,
      nameEn: body.nameEn,
      slug: cleanSlug,
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
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : (body.ingredients ? [body.ingredients] : []),
      dietaryTags: body.dietaryTags || [],
      displayOrder: Number(body.displayOrder) || 1,
      rating: 4.9,
      reviewsCount: 30,
    };

    const savedFallback = addStoreMenuItem(fallbackItem);
    return NextResponse.json(
      { success: true, message: 'খাবার সংরক্ষণ করা হয়েছে', data: savedFallback },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Unable to save food item right now' },
      { status: 500 }
    );
  }
}
