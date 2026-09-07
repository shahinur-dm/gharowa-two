import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { RestaurantSettings } from '@/models/RestaurantSettings';
import { getStoreSettings } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SVG_FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#900C19"/>
  <polygon points="50,15 85,45 15,45" fill="#F59E0B"/>
  <rect x="25" y="45" width="50" height="40" rx="4" fill="#FFFFFF"/>
  <rect x="42" y="60" width="16" height="25" rx="2" fill="#900C19"/>
  <text x="50" y="56" font-family="Arial, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#900C19">GH</text>
</svg>`;

export async function GET() {
  try {
    let faviconUrl = '';

    try {
      const db = await connectToDatabase();
      if (db) {
        const settings = await RestaurantSettings.findOne().lean();
        if (settings && settings.faviconUrl) {
          faviconUrl = settings.faviconUrl;
        }
      }
    } catch (e: any) {
      console.warn('MongoDB favicon fetch notice:', e.message);
    }

    if (!faviconUrl) {
      const storeSettings = getStoreSettings();
      if (storeSettings && storeSettings.faviconUrl) {
        faviconUrl = storeSettings.faviconUrl;
      }
    }

    // 1. Handle base64 data URI
    if (faviconUrl && faviconUrl.startsWith('data:')) {
      const match = faviconUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1] || 'image/png';
        const buffer = Buffer.from(match[2], 'base64');
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          },
        });
      }
    }

    // 2. Handle remote URL
    if (faviconUrl && (faviconUrl.startsWith('http://') || faviconUrl.startsWith('https://'))) {
      try {
        const res = await fetch(faviconUrl);
        if (res.ok) {
          const contentType = res.headers.get('content-type') || 'image/png';
          const arrayBuffer = await res.arrayBuffer();
          return new NextResponse(Buffer.from(arrayBuffer), {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            },
          });
        }
      } catch (fetchErr) {
        console.warn('Remote favicon fetch error:', fetchErr);
      }
    }

    // 3. Fallback default SVG favicon
    return new NextResponse(DEFAULT_SVG_FAVICON, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    });
  } catch (error: any) {
    return new NextResponse(DEFAULT_SVG_FAVICON, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      },
    });
  }
}
