import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRestaurantSettings extends Document {
  logoUrl?: string;
  faviconUrl?: string;
  menuBoardImageUrl?: string;
  isMenuBoardEnabled?: boolean;
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
  landmarkBn?: string;
  landmarkEn?: string;
  openingHoursBn: string;
  openingHoursEn: string;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  minOrderAmount: number;
  isOnlineOrderActive: boolean;
  // Hero
  heroTitleBn?: string;
  heroTitleEn?: string;
  heroSubtitleBn?: string;
  heroSubtitleEn?: string;
  heroBadgeBn?: string;
  heroBadgeEn?: string;
  heroMediaType?: 'image' | 'video';
  heroVideoUrl?: string;
  heroImageUrl?: string;
  heroPouringImageUrl?: string;
  heroCtaTextBn?: string;
  heroCtaTextEn?: string;
  heroCtaLink?: string;
  // About
  aboutTitleBn?: string;
  aboutTitleEn?: string;
  aboutSubtitleBn?: string;
  aboutSubtitleEn?: string;
  aboutStoryBn?: string;
  aboutStoryEn?: string;
  aboutImageUrl?: string;
  // Chef & Owner
  chefNameBn?: string;
  chefNameEn?: string;
  chefTitleBn?: string;
  chefTitleEn?: string;
  chefBioBn?: string;
  chefBioEn?: string;
  chefImageUrl?: string;
  ownerNameBn?: string;
  ownerNameEn?: string;
  ownerTitleBn?: string;
  ownerTitleEn?: string;
  ownerQuoteBn?: string;
  ownerQuoteEn?: string;
  ownerImageUrl?: string;
  // SEO & OG
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
}

const RestaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    menuBoardImageUrl: { type: String, default: '' },
    isMenuBoardEnabled: { type: Boolean, default: true },
    restaurantNameBn: { type: String, default: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট' },
    restaurantNameEn: { type: String, default: 'Gharowa Hotel & Restaurant' },
    taglineBn: { type: String, default: '১৯৭২ সাল থেকে মতিঝিলের ঐতিহ্যের আসল স্বাদ' },
    taglineEn: { type: String, default: '50+ Years of Authentic Culinary Heritage in Motijheel' },
    establishedYear: { type: Number, default: 1972 },
    phone: { type: String, default: '01973255888' },
    whatsappNumber: { type: String, default: '01973255888' },
    whatsappCountryCode: { type: String, default: '+880' },
    isWhatsAppOrderActive: { type: Boolean, default: true },
    whatsappOrderTemplate: {
      type: String,
      default:
        'Hello Gharowa Hotel & Restaurant (Since 1972),\n\nI would like to place an order from your website:\n\n🍛 Food: {{product_name}}\n🔢 Quantity: {{quantity}}\n💰 Unit Price: ৳{{price}}\n💵 Total: ৳{{total}}\n\nPlease confirm availability and delivery details. Thank you!',
    },
    email: { type: String, default: 'info@gharowa.com' },
    addressBn: { type: String, default: '৯/সি, মতিঝিল বা/এ (মেট্রোরেল স্টেশনের সন্নিকটে), ঢাকা-১০০০' },
    addressEn: { type: String, default: '9/C Motijheel C/A (Near Metro Station), Dhaka-1000' },
    landmarkBn: { type: String, default: 'মতিঝিল মেট্রোরেল স্টেশন সংলগ্ন' },
    landmarkEn: { type: String, default: 'Beside Motijheel Metro Station' },
    openingHoursBn: { type: String, default: 'প্রতিদিন সকাল ৭:০০ - রাত ১১:৩০' },
    openingHoursEn: { type: String, default: 'Everyday 7:00 AM - 11:30 PM' },
    standardDeliveryFee: { type: Number, default: 60 },
    freeDeliveryThreshold: { type: Number, default: 1000 },
    minOrderAmount: { type: Number, default: 150 },
    isOnlineOrderActive: { type: Boolean, default: true },
    heroTitleBn: { type: String, default: 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি' },
    heroTitleEn: { type: String, default: 'MUTTON KHICHURI' },
    heroSubtitleBn: { type: String, default: 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।' },
    heroSubtitleEn: { type: String, default: 'Traditional taste, rich aroma and perfectly cooked mutton.' },
    heroBadgeBn: { type: String, default: 'খাঁটি ও ঐতিহ্যবাহী' },
    heroBadgeEn: { type: String, default: 'AUTHENTIC' },
    heroMediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    heroVideoUrl: { type: String, default: '' },
    heroImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop',
    },
    heroPouringImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    },
    heroCtaTextBn: { type: String, default: 'অর্ডার করুন' },
    heroCtaTextEn: { type: String, default: 'Order Now' },
    heroCtaLink: { type: String, default: '/menu' },
    aboutTitleBn: { type: String, default: '১৯৭২ সাল থেকে স্বাদের বিশ্বস্ত ঐতিহ্য' },
    aboutTitleEn: { type: String, default: 'A Legacy of Taste Since 1972' },
    aboutSubtitleBn: { type: String, default: 'ঢাকার মতিঝিলে অর্ধশতাব্দীরও বেশি সময় ধরে আসল দেশি স্বাদের বিশ্বস্ত ঠিকানা।' },
    aboutSubtitleEn: { type: String, default: 'Over half a century of authentic culinary excellence in Motijheel, Dhaka.' },
    aboutStoryBn: { type: String, default: '১৯৭২ সালে স্বাধীনতার পরপরই মতিঝিলের বুকে শুরু হয় ঘরোয়া হোটেলের যাত্রা।...' },
    aboutStoryEn: { type: String, default: 'Founded in 1972 right after the independence of Bangladesh...' },
    aboutImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    },
    chefNameBn: { type: String, default: 'মাস্টার শেফ রফিকুল ইসলাম' },
    chefNameEn: { type: String, default: 'Master Chef Rafiqul Islam' },
    chefTitleBn: { type: String, default: 'প্রধান বাবুর্চি (Head Chef)' },
    chefTitleEn: { type: String, default: 'Head Chef (30+ Years Experience)' },
    chefBioBn: { type: String, default: 'তিন দশক ধরে ঘরোয়ার সিগনেচার খাসির ভুনা খিচুড়ি ও কাচ্চির আসল স্বাদ সংরক্ষণ করে আসছেন।' },
    chefBioEn: { type: String, default: 'Preserving the original secret spice recipes of Gharowa for over 30 years.' },
    chefImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop',
    },
    ownerNameBn: { type: String, default: 'হাজী মোহাম্মদ নূর হোসেন' },
    ownerNameEn: { type: String, default: 'Haji Mohammad Nur Hossain' },
    ownerTitleBn: { type: String, default: 'প্রতিষ্ঠাতা ও স্বত্বাধিকারী' },
    ownerTitleEn: { type: String, default: 'Founder & Proprietor' },
    ownerQuoteBn: { type: String, default: 'খাবারের মানের সাথে কোনো আপস নয় — এটাই ১৯৭২ সাল থেকে আমাদের প্রতিজ্ঞা।' },
    ownerQuoteEn: { type: String, default: 'No compromise on food quality and customer satisfaction since 1972.' },
    ownerImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    },
    seoTitle: { type: String, default: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972) — মতিঝিল, ঢাকা' },
    seoDescription: { type: String, default: '১৯৭২ সাল থেকে ঢাকার মতিঝিলের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, স্পেশাল কাচ্চি ও বোরহানি।' },
    ogTitle: { type: String, default: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972) — মতিঝিল, ঢাকা' },
    ogDescription: { type: String, default: '১৯৭২ সাল থেকে মতিঝিলের খাঁটি খাসির ভুনা খিচুড়ি ও কাচ্চির আসল ঠিকানা।' },
    ogImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const RestaurantSettings: Model<IRestaurantSettings> =
  mongoose.models.RestaurantSettings ||
  mongoose.model<IRestaurantSettings>('RestaurantSettings', RestaurantSettingsSchema);
