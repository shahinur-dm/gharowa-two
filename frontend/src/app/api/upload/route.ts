import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, filename } = body;

    if (!image) {
      return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 });
    }

    // In a serverless/cloud environment on Vercel:
    // If base64 or URL is provided, return standard data/hosted URL
    const imageUrl = image.startsWith('http') || image.startsWith('data:')
      ? image
      : `data:image/jpeg;base64,${image}`;

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
