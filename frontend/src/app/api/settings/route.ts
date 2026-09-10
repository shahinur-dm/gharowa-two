import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { RestaurantSettings } from '@/models/RestaurantSettings';
import { getStoreSettings, updateStoreSettings } from '@/lib/serverStore';
import { getCachedSettings, setCachedSettings, invalidateSettingsCache } from '@/lib/cacheManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const cached = getCachedSettings();
  if (cached) {
    return NextResponse.json(
      { success: true, data: cached },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await RestaurantSettings.findOne().lean();
      if (settings) {
        setCachedSettings(settings);
        updateStoreSettings(settings);
        return NextResponse.json(
          { success: true, data: settings },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB settings fetch notice:', error.message);
  }

  const fallback = getStoreSettings();
  return NextResponse.json(
    { success: true, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
  );
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    try {
      const db = await connectToDatabase();
      if (db) {
        const updateData = { ...body };
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.__v;

        const settings = await RestaurantSettings.findOneAndUpdate(
          {},
          { $set: updateData },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        ).lean();

        if (settings) {
          setCachedSettings(settings);
          updateStoreSettings(settings);
          try {
            revalidatePath('/');
            revalidatePath('/menu');
            revalidatePath('/about');
          } catch (revalErr) {}

          return NextResponse.json(
            { success: true, message: 'Settings updated successfully', data: settings },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
          );
        }
      }
    } catch (e: any) {
      console.error('MongoDB settings update error:', e.message);
      return NextResponse.json(
        { success: false, message: e.message || 'ডাটাবেজ সেটিংস সংরক্ষণ করা যায়নি' },
        { status: 500 }
      );
    }

    invalidateSettingsCache();
    const updated = updateStoreSettings(body);
    setCachedSettings(updated);
    return NextResponse.json(
      { success: true, message: 'Settings updated successfully', data: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to update settings right now' },
      { status: 500 }
    );
  }
}
