import { NextResponse } from 'next/server';
import { getStoreOrders } from '@/lib/serverStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();

    const orders = getStoreOrders();

    // Map unique customers from orders
    const customerMap = new Map<string, any>();

    // Initial mock customer base
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

    // Aggregate from placed orders
    orders.forEach((o) => {
      const phone = o.customer?.phone;
      if (phone) {
        const existing = customerMap.get(phone);
        if (existing) {
          existing.totalOrders += 1;
          existing.totalSpent += o.grandTotal || 0;
          existing.lastOrderDate = o.createdAt || existing.lastOrderDate;
        } else {
          customerMap.set(phone, {
            _id: `cust-${phone}`,
            name: o.customer?.name || 'Customer',
            phone: phone,
            address: o.customer?.address || '',
            totalOrders: 1,
            totalSpent: o.grandTotal || 0,
            lastOrderDate: o.createdAt || new Date().toISOString(),
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
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
