import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ReservationData {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  tableType?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: string;
}

let globalReservations: ReservationData[] = [
  {
    _id: 'res-1',
    name: 'তানভীর আহমেদ',
    phone: '01712345678',
    email: 'tanveer@example.com',
    guests: 4,
    date: '2026-09-10',
    time: '20:00',
    tableType: 'Family Table',
    specialRequests: 'Window seat preferred',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'res-2',
    name: 'মাহমুদুল হাসান',
    phone: '01898765432',
    guests: 2,
    date: '2026-09-11',
    time: '19:30',
    tableType: 'Couple',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let results = [...globalReservations];
  if (status && status !== 'all') {
    results = results.filter((r) => r.status === status);
  }

  return NextResponse.json(
    { success: true, count: results.length, data: results },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'নাম এবং মোবাইল নম্বর আবশ্যক' },
        { status: 400 }
      );
    }

    const newRes: ReservationData = {
      _id: `res-${Date.now()}`,
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: body.email ? String(body.email).trim() : undefined,
      guests: Number(body.guests) || 2,
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '19:00',
      tableType: body.tableType || 'General',
      specialRequests: body.specialRequests || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    globalReservations.unshift(newRes);

    return NextResponse.json(
      {
        success: true,
        message: 'টেবিল বুকিং অনুরোধ সফলভাবে গৃহীত হয়েছে! শীঘ্রই যোগাযোগ করা হবে।',
        data: newRes,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
