import { toBanglaNumber } from './bangla';

export interface WhatsAppOrderPayload {
  orderNumber: string;
  items: Array<{
    nameBn: string;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  grandTotal: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  paymentMethod: string;
  specialInstructions?: string;
}

export const generateWhatsAppOrderMessage = (order: WhatsAppOrderPayload): string => {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${toBanglaNumber(idx + 1)}. ${item.nameBn} × ${toBanglaNumber(item.quantity)} — ৳${toBanglaNumber(item.subtotal)}`
    )
    .join('\n');

  const paymentName =
    order.paymentMethod === 'bkash'
      ? 'bKash (অনলাইন)'
      : order.paymentMethod === 'nagad'
      ? 'Nagad (অনলাইন)'
      : 'Cash on Delivery (ক্যাশ অন ডেলিভারি)';

  const instructionsText = order.specialInstructions
    ? `\nবিশেষ অনুরোধ: ${order.specialInstructions}`
    : '';

  const message = `আসসালামু আলাইকুম,
আমি Gharowa Hotel & Restaurant থেকে অর্ডার করতে চাই।

Order ID: ${order.orderNumber}

আইটেম:
${itemsText}

Subtotal: ৳${toBanglaNumber(order.subtotal)}
Delivery: ৳${toBanglaNumber(order.deliveryCharge)}
Discount: ৳${toBanglaNumber(order.discount)}

Total: ৳${toBanglaNumber(order.grandTotal)}

Customer:
নাম: ${order.customer.name}
ফোন: ${order.customer.phone}
ঠিকানা: ${order.customer.address}${instructionsText}

Payment: ${paymentName}

ধন্যবাদ।`;

  return message;
};

export const createWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};
