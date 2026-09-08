import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'Reservation status updated successfully',
      data: { id, status: body.status },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update reservation status' },
      { status: 500 }
    );
  }
}
