import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getStoreOrders, addStoreOrder, getStoreSettings } from '@/lib/serverStore';
import { generateWhatsAppOrderMessage, createWhatsAppUrl } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    try {
      const db = await connectToDatabase();
      if (db) {
        const query: any = {};
        if (status && status !== 'all') {
          query.orderStatus = status;
        }
        if (search) {
          const regex = new RegExp(search.trim(), 'i');
          query.$or = [
            { orderNumber: regex },
            { 'customer.name': regex },
            { 'customer.phone': regex },
          ];
        }

        const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
        if (orders && orders.length > 0) {
          return NextResponse.json({
            success: true,
            count: orders.length,
            data: orders,
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB orders fetch fallback:', dbErr.message);
    }

    const fallbackOrders = getStoreOrders({ status, search });
    return NextResponse.json({
      success: true,
      count: fallbackOrders.length,
      data: fallbackOrders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, orderType, paymentMethod, couponCode, specialInstructions } = body;

    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { success: false, message: 'গ্রাহকের নাম ও ফোন নম্বর প্রদান করুন' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'কার্টে কোনো খাবারের আইটেম পাওয়া যায়নি' },
        { status: 400 }
      );
    }

    const settings = getStoreSettings();
    const standardFee = settings.standardDeliveryFee || 60;
    const freeThreshold = settings.freeDeliveryThreshold || 1000;
    const whatsappPhone = settings.whatsappNumber || settings.phone || '01973255888';

    // Calculate subtotal
    let subtotal = 0;
    const orderItems = items.map((item: any) => {
      const price = Number(item.unitPrice || item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const itemSubtotal = price * quantity;
      subtotal += itemSubtotal;

      return {
        menuItem: item.menuItemId || undefined,
        nameBn: item.nameBn || 'খাবার আইটেম',
        nameEn: item.nameEn || '',
        price,
        quantity,
        subtotal: itemSubtotal,
        notes: item.notes || '',
      };
    });

    const isTakeaway = orderType === 'takeaway';
    const deliveryCharge = isTakeaway
      ? 0
      : freeThreshold > 0 && subtotal >= freeThreshold
      ? 0
      : standardFee;

    const discount = 0; // Handled if coupon code is verified
    const grandTotal = Math.max(0, subtotal + deliveryCharge - discount);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `GH-${randomSuffix}`;

    // Normalize paymentMethod
    const validPaymentMethod =
      paymentMethod === 'bkash'
        ? 'bkash'
        : paymentMethod === 'nagad'
        ? 'nagad'
        : 'cash_on_delivery';

    const cleanAddress = customer.address || (isTakeaway ? 'টেক-অ্যাওয়ে / রেস্তোরাঁ থেকে পিকআপ' : 'ঢাকা');

    // Generate WhatsApp message & deep link
    const whatsappMessage = generateWhatsAppOrderMessage({
      orderNumber,
      items: orderItems,
      subtotal,
      deliveryCharge,
      discount,
      grandTotal,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: cleanAddress.trim(),
      },
      paymentMethod: validPaymentMethod,
      specialInstructions,
    });

    const whatsappDeepLink = createWhatsAppUrl(whatsappPhone, whatsappMessage);

    const orderPayload = {
      orderNumber,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        address: cleanAddress.trim(),
        area: customer.area || 'motijheel',
      },
      items: orderItems,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: couponCode ? String(couponCode).trim() : undefined,
      grandTotal,
      paymentMethod: validPaymentMethod,
      paymentStatus: (validPaymentMethod === 'bkash' || validPaymentMethod === 'nagad') ? 'pending' : 'pending',
      orderStatus: 'pending',
      source: 'website_whatsapp',
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date().toISOString(),
          note: `ওয়েবসাইট থেকে অর্ডার গৃহীত (${validPaymentMethod})`,
        },
      ],
      specialInstructions: specialInstructions ? specialInstructions.trim() : undefined,
      whatsappMessage,
      estimatedDeliveryMinutes: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let savedOrder: any = null;

    try {
      const db = await connectToDatabase();
      if (db) {
        const created = await Order.create({
          ...orderPayload,
          statusHistory: [
            {
              status: 'pending',
              changedAt: new Date(),
              note: `ওয়েবসাইট থেকে অর্ডার গৃহীত (${validPaymentMethod})`,
            },
          ],
        });
        if (created) {
          savedOrder = created.toObject ? created.toObject() : created;
        }
      }
    } catch (dbErr: any) {
      console.warn('MongoDB order create notice:', dbErr.message);
    }

    if (!savedOrder) {
      savedOrder = {
        ...orderPayload,
        _id: `ord-${Date.now()}`,
      };
    }

    addStoreOrder({
      ...savedOrder,
      _id: String(savedOrder._id),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'অর্ডার সফলভাবে তৈরি হয়েছে',
        data: {
          orderId: savedOrder._id,
          orderNumber: savedOrder.orderNumber,
          grandTotal: savedOrder.grandTotal,
          paymentMethod: validPaymentMethod,
          whatsappMessage,
          whatsappDeepLink,
          order: savedOrder,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'অর্ডার প্রক্রিয়া সম্পন্ন করা যায়নি',
      },
      { status: 500 }
    );
  }
}
