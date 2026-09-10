import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Reservation } from '@/models/Reservation';
import { ensureDbBootstrapped } from '@/lib/dbBootstrap';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    await ensureDbBootstrapped();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, count: reservations.length, data: reservations },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (err: any) {
    console.error('Error fetching reservations:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reservations: ' + err.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    await ensureDbBootstrapped();

    const body = await request.json();
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: 'নাম এবং মোবাইল নম্বর আবশ্যক' },
        { status: 400 }
      );
    }

    const reservationData = {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: body.email ? String(body.email).trim() : undefined,
      guests: Number(body.guests) || 2,
      date: body.date || new Date().toISOString().split('T')[0],
      time: body.time || '19:00',
      tableType: body.tableType || 'General',
      specialRequests: body.specialRequests ? String(body.specialRequests).trim() : '',
      status: 'pending' as const,
    };

    const saved = await Reservation.create(reservationData);
    const savedObj = saved.toObject ? saved.toObject() : saved;

    return NextResponse.json(
      {
        success: true,
        message: 'টেবিল বুকিং অনুরোধ সফলভাবে গৃহীত হয়েছে! শীঘ্রই যোগাযোগ করা হবে।',
        data: savedObj,
      },
      { status: 201, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (err: any) {
    console.error('Error creating reservation:', err);
    return NextResponse.json(
      { success: false, message: 'বুকিং তৈরি করা সম্ভব হয়নি: ' + (err.message || 'Database error') },
      { status: 500 }
    );
  }
}
