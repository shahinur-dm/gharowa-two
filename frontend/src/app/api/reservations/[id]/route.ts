import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    return NextResponse.json({
      success: true,
      message: 'Reservation deleted successfully',
      data: { id },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
