import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { MediaAsset } from '@/models/MediaAsset';
import { addStoreMediaItem } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, filename, category } = body;

    if (!image) {
      return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 });
    }

    // In a serverless/cloud environment on Vercel:
    // If base64 or URL is provided, return standard data/hosted URL
    const imageUrl = image.startsWith('http') || image.startsWith('data:')
      ? image
      : `data:image/jpeg;base64,${image}`;

    const mediaData = {
      _id: `m-${Date.now()}`,
      id: `m-${Date.now()}`,
      title: filename ? filename.replace(/[-_]/g, ' ') : 'Uploaded Image',
      category: category || 'general',
      url: imageUrl,
      size: 'Uploaded Asset',
      addedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const db = await connectToDatabase();
      if (db) {
        await MediaAsset.create(mediaData);
      }
    } catch (e: any) {
      console.warn('Media library auto-save notice:', e.message);
    }

    addStoreMediaItem(mediaData);

    return NextResponse.json(
      {
        success: true,
        message: 'Image uploaded successfully',
        url: imageUrl,
        filename: filename || 'uploaded_image',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to process image upload. Please try a valid image URL or format.',
      },
      { status: 500 }
    );
  }
}

