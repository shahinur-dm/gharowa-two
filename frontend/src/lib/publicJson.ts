import { NextResponse } from 'next/server';

export const PUBLIC_CACHE = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

export function instantList(data: unknown[]) {
  return NextResponse.json(
    { success: true, count: data.length, data },
    { headers: PUBLIC_CACHE }
  );
}

export function instantItem(data: unknown) {
  return NextResponse.json({ success: true, data }, { headers: PUBLIC_CACHE });
}
