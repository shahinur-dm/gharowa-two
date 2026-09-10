import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { RestaurantSettings } from '@/models/RestaurantSettings';
import { getStoreSettings, updateStoreSettings, defaultSettings } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let cachedSettingsData: any = null;
let lastSettingsFetchTime = 0;
const SETTINGS_CACHE_TTL_MS = 60000;

export async function GET() {
  const now = Date.now();
  if (cachedSettingsData && now - lastSettingsFetchTime < SETTINGS_CACHE_TTL_MS) {
    return NextResponse.json(
      { success: true, data: cachedSettingsData },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await RestaurantSettings.findOne().lean();
      if (settings) {
        cachedSettingsData = settings;
        lastSettingsFetchTime = now;
        updateStoreSettings(settings);
        return NextResponse.json(
          { success: true, data: settings },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB settings fetch notice:', error.message);
  }

  if (cachedSettingsData) {
    return NextResponse.json(
      { success: true, data: cachedSettingsData },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }

  const fallback = getStoreSettings();
  return NextResponse.json(
    { success: true, data: fallback },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
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
          cachedSettingsData = settings;
          lastSettingsFetchTime = Date.now();
          updateStoreSettings(settings);
          try {
            revalidatePath('/', 'layout');
            revalidatePath('/');
            revalidatePath('/menu');
            revalidatePath('/about');
            revalidatePath('/contact');
          } catch (revalErr) {}

          return NextResponse.json(
            { success: true, message: 'Settings updated successfully', data: settings },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
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

    const updated = updateStoreSettings(body);
    cachedSettingsData = updated;
    lastSettingsFetchTime = Date.now();
    return NextResponse.json(
      { success: true, message: 'Settings updated successfully', data: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Unable to update settings right now' },
      { status: 500 }
    );
  }
}
