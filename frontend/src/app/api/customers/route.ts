import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();

    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    // Map unique customers from orders
    const customerMap = new Map<string, any>();

    // Initial base customer contacts
    customerMap.set('01733917395', {
      _id: 'cust-1',
      name: 'Shahinur Akter',
      phone: '01733917395',
      address: 'House #12, Road #4, Tongi',
      totalOrders: 3,
      totalSpent: 1140,
      lastOrderDate: '2026-09-08',
    });

    customerMap.set('01712345678', {
      _id: 'cust-2',
      name: 'তানভীর আহমেদ',
      phone: '01712345678',
      address: 'ওয়ারী, ঢাকা',
      totalOrders: 5,
      totalSpent: 2450,
      lastOrderDate: '2026-09-07',
    });

    // Aggregate from placed orders in MongoDB
    orders.forEach((o: any) => {
      const phone = o.customer?.phone;
      if (phone) {
        const existing = customerMap.get(phone);
        if (existing) {
          existing.totalOrders += 1;
          existing.totalSpent += o.grandTotal || 0;
          existing.lastOrderDate = o.createdAt ? String(o.createdAt).split('T')[0] : existing.lastOrderDate;
        } else {
          customerMap.set(phone, {
            _id: `cust-${phone}`,
            name: o.customer?.name || 'Customer',
            phone: phone,
            address: o.customer?.address || '',
            totalOrders: 1,
            totalSpent: o.grandTotal || 0,
            lastOrderDate: o.createdAt ? String(o.createdAt).split('T')[0] : new Date().toISOString().split('T')[0],
          });
        }
      }
    });

    let customers = Array.from(customerMap.values());

    if (search) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          c.address.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(
      { success: true, count: customers.length, data: customers },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (err: any) {
    console.error('Failed to fetch customers:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers: ' + err.message },
      { status: 500 }
    );
  }
}
