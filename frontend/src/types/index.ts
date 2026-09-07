export type Language = 'bn' | 'en';

export interface MenuCategory {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  descriptionBn?: string;
  descriptionEn?: string;
  image?: string;
  displayOrder: number;
  icon?: string;
  isActive: boolean;
}

export interface PortionOption {
  nameBn: string;
  nameEn: string;
  price: number;
  servingSize: string;
}

export interface AddOnOption {
  nameBn: string;
  nameEn: string;
  price: number;
}

export interface NutritionFacts {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
}

export interface MenuItem {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  sku?: string;
  category: MenuCategory | string;
  price: number;
  originalPrice?: number;
  descriptionBn: string;
  descriptionEn: string;
  shortDescriptionBn?: string;
  shortDescriptionEn?: string;
  image: string;
  galleryImages?: string[];
  spiceLevel: number;
  isAvailable: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isPopular?: boolean;
  preparationTimeMinutes?: number;
  servingSize?: string;
  ingredients?: string;
  dietaryTags: string[];
  displayOrder: number;
  rating?: number;
  reviewsCount?: number;
  portions?: PortionOption[];
  addOns?: AddOnOption[];
  nutritionFacts?: NutritionFacts;
  aboutDishBn?: string;
  aboutDishEn?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SelectedAddOn {
  name: string;
  price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedPortion?: {
    name: string;
    price: number;
  };
  selectedAddOns?: SelectedAddOn[];
  unitPrice?: number;
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
  logoUrl?: string;
  faviconUrl?: string;
  restaurantNameBn: string;
  restaurantNameEn: string;
  taglineBn: string;
  taglineEn: string;
  establishedYear: number;
  phone: string;
  whatsappNumber: string;
  whatsappCountryCode?: string;
  isWhatsAppOrderActive?: boolean;
  whatsappOrderTemplate?: string;
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
  // Hero CMS
  heroTitleBn?: string;
  heroTitleEn?: string;
  heroSubtitleBn?: string;
  heroSubtitleEn?: string;
  heroBadgeBn?: string;
  heroBadgeEn?: string;
  heroImageUrl?: string;
  heroPouringImageUrl?: string;
  heroBgPatternUrl?: string;
  heroCtaTextBn?: string;
  heroCtaTextEn?: string;
  heroCtaLink?: string;
  // About Us CMS
  aboutTitleBn?: string;
  aboutTitleEn?: string;
  aboutDescBn?: string;
  aboutDescEn?: string;
  aboutImageUrl?: string;
  aboutStats?: Array<{
    labelBn: string;
    labelEn: string;
    value: string;
  }>;
  // Chef CMS
  chefName?: string;
  chefNameBn?: string;
  chefNameEn?: string;
  chefTitleBn?: string;
  chefTitleEn?: string;
  chefDesignation?: string;
  chefBioBn?: string;
  chefBioEn?: string;
  chefExperience?: string;
  chefSpecialty?: string;
  chefImageUrl?: string;
  // Owner CMS
  ownerName?: string;
  ownerNameBn?: string;
  ownerNameEn?: string;
  ownerTitleBn?: string;
  ownerTitleEn?: string;
  ownerDesignation?: string;
  ownerStoryBn?: string;
  ownerStoryEn?: string;
  ownerQuoteBn?: string;
  ownerQuoteEn?: string;
  ownerImageUrl?: string;
  // Menu Board Image CMS
  menuBoardImageUrl?: string;
  isMenuBoardEnabled?: boolean;
  // Popular Dishes CMS
  popularDishesTitleBn?: string;
  popularDishesTitleEn?: string;
  popularDishesSubtitleBn?: string;
  popularDishesSubtitleEn?: string;
  isPopularDishesEnabled?: boolean;
  // Footer & Branding CMS
  footerDescriptionBn?: string;
  footerDescriptionEn?: string;
  copyrightTextBn?: string;
  copyrightTextEn?: string;
  // SEO & OpenGraph
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'manager' | 'cashier' | 'kitchen_staff';
}

export interface BlogVideo {
  _id: string;
  title: string;
  titleBn?: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: string;
  authorName?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerReview {
  _id: string;
  customerName: string;
  avatarUrl?: string;
  rating: number;
  reviewText: string;
  reviewDateText?: string;
  platform?: 'google' | 'facebook' | 'direct';
  isVerified?: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandPartner {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

