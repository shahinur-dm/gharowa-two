import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন / Enter valid email'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে / Minimum 6 characters'),
});

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1, 'Menu item ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(2, 'নাম লিখুন / Name is required'),
    phone: z.string().min(11, '১১ ডিজিটের মোবাইল নম্বর দিন / Valid 11 digit phone required'),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().min(5, 'ঠিকানা লিখুন / Address is required'),
    area: z.string().optional(),
  }),
  items: z.array(orderItemSchema).min(1, 'কমপক্ষে একটি আইটেম যোগ করুন / Cart cannot be empty'),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['cash_on_delivery', 'bkash', 'nagad', 'pos_card', 'counter_cash']).default('cash_on_delivery'),
  source: z.enum(['website', 'website_whatsapp', 'phone', 'counter']).default('website_whatsapp'),
  specialInstructions: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'cooking', 'ready', 'delivered', 'cancelled']),
  note: z.string().optional(),
});

export const createReservationSchema = z.object({
  name: z.string().min(2, 'নাম আবশ্যক / Name is required'),
  phone: z.string().min(11, '১১ ডিজিটের মোবাইল নম্বর দিন / Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD ফরম্যাটে তারিখ দিন / Valid date format YYYY-MM-DD'),
  timeSlot: z.string().min(2, 'সময় নির্বাচন করুন / Time slot is required'),
  guestCount: z.number().int().min(1).max(100),
  seatingPreference: z.enum(['main_hall', 'family_ac', 'executive', 'rooftop_terrace', 'vip']).default('main_hall'),
  specialRequests: z.string().optional(),
});

export const menuItemSchema = z.object({
  nameBn: z.string().min(2, 'বাংলা নাম আবশ্যক'),
  nameEn: z.string().min(2, 'English name is required'),
  slug: z.string().min(2),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().optional(),
  descriptionBn: z.string().default(''),
  descriptionEn: z.string().default(''),
  image: z.string().min(1, 'Image URL is required'),
  spiceLevel: z.number().min(0).max(3).default(1),
  isAvailable: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  preparationTimeMinutes: z.number().default(15),
  dietaryTags: z.array(z.string()).default([]),
  displayOrder: z.number().default(0),
});

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  titleBn: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionBn: z.string().optional(),
  descriptionEn: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  maxDiscountAmount: z.number().positive().optional(),
  startDate: z.string().optional(),
  expiryDate: z.string(),
  isActive: z.boolean().default(true),
  maxUsageLimit: z.number().positive().optional(),
});

export const inventoryItemSchema = z.object({
  nameBn: z.string().min(2),
  nameEn: z.string().min(2),
  category: z.enum(['meat_poultry', 'fish', 'rice_grains', 'spices_oil', 'dairy_beverage', 'packaging', 'produce']),
  unit: z.enum(['kg', 'liter', 'piece', 'packet', 'gram']),
  currentStock: z.number().min(0),
  minStockThreshold: z.number().min(0),
  costPerUnit: z.number().min(0),
  supplier: z.string().optional(),
});

export const inventoryAdjustmentSchema = z.object({
  type: z.enum(['purchase', 'adjustment', 'waste', 'order_consumption', 'return']),
  quantity: z.number(),
  unitCost: z.number().optional(),
  reason: z.string().optional(),
  referenceId: z.string().optional(),
});

export const restaurantSettingsSchema = z.object({
  restaurantNameBn: z.string(),
  restaurantNameEn: z.string(),
  taglineBn: z.string(),
  taglineEn: z.string(),
  phone: z.string(),
  whatsappNumber: z.string(),
  email: z.string().email(),
  addressBn: z.string(),
  addressEn: z.string(),
  landmarkBn: z.string(),
  landmarkEn: z.string(),
  openingHoursBn: z.string(),
  openingHoursEn: z.string(),
  standardDeliveryFee: z.number().nonnegative(),
  freeDeliveryThreshold: z.number().nonnegative(),
  minOrderAmount: z.number().nonnegative(),
  isOnlineOrderActive: z.boolean(),
  announcementBn: z.string().optional(),
  announcementEn: z.string().optional(),
  isAnnouncementActive: z.boolean(),
  googleMapsUrl: z.string(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
  }),
});
