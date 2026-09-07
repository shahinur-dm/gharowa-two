import { NextResponse } from 'next/server';
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
          const catDoc = await MenuCategory.findOne({ slug: category });
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

        let items = await MenuItem.find(query).populate('category').sort({ displayOrder: 1 }).lean();

        if (items) {
          return NextResponse.json(
            { success: true, count: items.length, data: items },
            {
              headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              },
            }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB public items query notice:', e.message);
    }

    // Live store fallback
    let liveItems = getStoreMenuItems().filter((i) => i.isAvailable !== false);

    if (category && category !== 'all' && category !== 'সব') {
      liveItems = liveItems.filter((i) => {
        const catSlug = typeof i.category === 'object' ? (i.category as any).slug : i.category;
        return catSlug === category;
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
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    const fallback = getStoreMenuItems();
    return NextResponse.json(
      { success: true, count: fallback.length, data: fallback },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
