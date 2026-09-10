import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { MenuCategory } from '@/models/MenuCategory';
import { getStoreMenuItems } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const bestseller = searchParams.get('bestseller');

    try {
      const db = await connectToDatabase();
      if (db) {
        const query: any = { isAvailable: { $ne: false } };

        if (category && category !== 'all' && category !== 'সব') {
          let catDoc = null;
          if (mongoose.isValidObjectId(category)) {
            catDoc = await MenuCategory.findById(category);
          }
          if (!catDoc) {
            const cleanCat = category.replace(/^cat-/, '');
            catDoc = await MenuCategory.findOne({
              $or: [{ slug: category }, { slug: cleanCat }, { nameEn: category }, { nameBn: category }],
            });
          }
          if (catDoc) {
            query.category = catDoc._id;
          }
        }

        if (featured === 'true') {
          query.$or = [{ isFeatured: true }, { isPopular: true }, { isBestseller: true }];
        }

        if (bestseller === 'true') {
          query.isBestseller = true;
        }

        if (search) {
          const regex = new RegExp(search, 'i');
          query.$or = [{ nameBn: regex }, { nameEn: regex }, { sku: regex }];
        }

        const items = await MenuItem.find(query).populate('category').sort({ displayOrder: 1, createdAt: -1 }).lean();

        return NextResponse.json(
          { success: true, count: items.length, data: items || [] },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            },
          }
        );
      }
    } catch (e: any) {
      console.warn('MongoDB public items query notice:', e.message);
    }

    // Live store fallback
    let liveItems = getStoreMenuItems().filter((i) => i.isAvailable !== false);

    if (category && category !== 'all' && category !== 'সব') {
      liveItems = liveItems.filter((i) => {
        const catSlug = typeof i.category === 'object' && i.category !== null ? (i.category as any).slug : i.category;
        const catId = typeof i.category === 'object' && i.category !== null ? String((i.category as any)._id) : String(i.category);
        return catSlug === category || catId === category;
      });
    }

    if (featured === 'true') {
      liveItems = liveItems.filter((i) => i.isFeatured || i.isPopular || i.isBestseller);
    }

    if (bestseller === 'true') {
      liveItems = liveItems.filter((i) => i.isBestseller);
    }

    if (search) {
      const q = search.toLowerCase();
      liveItems = liveItems.filter(
        (i) =>
          i.nameBn.includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          (i.sku && i.sku.toLowerCase().includes(q))
      );
    }

    return NextResponse.json(
      { success: true, count: liveItems.length, data: liveItems },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    const fallback = getStoreMenuItems();
    return NextResponse.json(
      { success: true, count: fallback.length, data: fallback },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  }
}
