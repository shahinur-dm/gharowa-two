import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MenuItem } from '@/models/MenuItem';
import { getStoreMenuItems } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    try {
      const db = await connectToDatabase();
      if (db) {
        let item = await MenuItem.findOne({
          $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
        })
          .populate('category')
          .lean();

        if (item) {
          return NextResponse.json(
            { success: true, data: item },
            {
              headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              },
            }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB slug query notice:', e.message);
    }

    const liveItems = getStoreMenuItems();
    const item = liveItems.find((i) => i.slug === slug || i._id === slug);

    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: item },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
