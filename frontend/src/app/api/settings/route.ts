import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { RestaurantSettings } from '@/models/RestaurantSettings';
import { getStoreSettings, updateStoreSettings, defaultSettings } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await RestaurantSettings.findOne().lean();
      if (settings) {
        return NextResponse.json(
          { success: true, data: settings },
          { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        );
      }
    }
  } catch (error: any) {
    console.warn('MongoDB settings fetch notice:', error.message);
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
        const settings = await RestaurantSettings.findOneAndUpdate({}, body, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }).lean();

        if (settings) {
          updateStoreSettings(body);
          return NextResponse.json(
            { success: true, message: 'Settings updated successfully', data: settings },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
          );
        }
      }
    } catch (e: any) {
      console.warn('MongoDB settings update notice:', e.message);
    }

    const updated = updateStoreSettings(body);
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
