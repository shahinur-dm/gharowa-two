import { NextResponse } from 'next/server';
import { getStoreMenuItems, updateStoreMenuItem } from '@/lib/serverStore';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const item = getStoreMenuItems().find((i) => i._id === id);
    if (!item) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    const updated = updateStoreMenuItem(id, { isAvailable: !item.isAvailable });
    return NextResponse.json({
      success: true,
      message: 'Availability toggled',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
