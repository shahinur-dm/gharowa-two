export type Language = 'bn' | 'en';

export interface MenuCategory {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  displayOrder: number;
  icon?: string;
  isActive: boolean;
}

export interface MenuItem {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  category: MenuCategory | string;
  price: number;
  originalPrice?: number;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  spiceLevel: number;
  isAvailable: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  preparationTimeMinutes?: number;
  dietaryTags: string[];
  displayOrder: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface Coupon {
  _id?: string;
  code: string;
  titleBn: string;
  titleEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  isActive: boolean;
}

export interface OrderItem {
  menuItem: string | MenuItem;
  nameBn: string;
  nameEn: string;
  price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    area?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod: 'cash_on_delivery' | 'bkash' | 'nagad' | 'pos_card' | 'counter_cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'cooking' | 'ready' | 'delivered' | 'cancelled';
  source: 'website' | 'website_whatsapp' | 'phone' | 'counter';
  statusHistory: Array<{
    status: string;
    changedAt: string;
    changedBy?: string;
    note?: string;
  }>;
  specialInstructions?: string;
  whatsappMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  _id: string;
  reservationNumber: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  seatingPreference: 'main_hall' | 'family_ac' | 'executive' | 'rooftop_terrace' | 'vip';
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  tableNumber?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface InventoryItem {
  _id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  unit: string;
  currentStock: number;
  minStockThreshold: number;
  costPerUnit: number;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastRestockedDate?: string;
}

export interface RestaurantSettings {
  restaurantNameBn: string;
  restaurantNameEn: string;
  taglineBn: string;
  taglineEn: string;
  establishedYear: number;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressBn: string;
  addressEn: string;
  landmarkBn: string;
  landmarkEn: string;
  openingHoursBn: string;
  openingHoursEn: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  isOnlineOrderActive: boolean;
  announcementBn?: string;
  announcementEn?: string;
  isAnnouncementActive: boolean;
  googleMapsUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'manager' | 'cashier' | 'kitchen_staff';
}
