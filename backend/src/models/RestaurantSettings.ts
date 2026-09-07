import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurantSettings extends Document {
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
  chefDesignation?: string;
  chefBioBn?: string;
  chefBioEn?: string;
  chefExperience?: string;
  chefSpecialty?: string;
  chefImageUrl?: string;
  // Owner CMS
  ownerName?: string;
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

const RestaurantSettingsSchema = new Schema<IRestaurantSettings>(
  {
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    menuBoardImageUrl: { type: String, default: '' },
    isMenuBoardEnabled: { type: Boolean, default: true },
    restaurantNameBn: { type: String, default: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট' },
    restaurantNameEn: { type: String, default: 'Gharowa Hotel & Restaurant' },
    taglineBn: { type: String, default: '১৯৭২ থেকে ঢাকার হৃদয়ে ঐতিহ্যের স্বাদ' },
    taglineEn: { type: String, default: '50+ Years of Authentic Culinary Heritage in Motijheel, Dhaka' },
    establishedYear: { type: Number, default: 1972 },
    phone: { type: String, default: '01973255888' },
    whatsappNumber: { type: String, default: '8801973255888' },
    whatsappCountryCode: { type: String, default: '+880' },
    isWhatsAppOrderActive: { type: Boolean, default: true },
    whatsappOrderTemplate: {
      type: String,
      default: `Hello Gharowa Hotel & Restaurant (Since 1972),\n\nI would like to place an order from your website:\n\n🍛 Food: {{product_name}}\n🔢 Quantity: {{quantity}}\n💰 Price: {{price}}\n💵 Total: {{total}}\n\nPlease confirm availability and delivery details. Thank you!`,
    },
    email: { type: String, default: 'info@gharowarestaurant.com' },
    addressBn: { type: String, default: '৯/সি মতিঝিল বা/এ, ঢাকা-১০০০' },
    addressEn: { type: String, default: '9/C Motijheel C/A, Dhaka-1000' },
    landmarkBn: { type: String, default: 'মতিঝিল মেট্রোরেল স্টেশন ও শাপলা চত্বরের সংলগ্ন' },
    landmarkEn: { type: String, default: 'Next to Motijheel Metro Station & Shapla Chottor' },
    openingHoursBn: { type: String, default: 'সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)' },
    openingHoursEn: { type: String, default: '7:00 AM - 11:30 PM (Everyday)' },
    standardDeliveryFee: { type: Number, default: 60 },
    freeDeliveryThreshold: { type: Number, default: 1500 },
    minOrderAmount: { type: Number, default: 150 },
    isOnlineOrderActive: { type: Boolean, default: true },
    announcementBn: { type: String, default: '৫০+ বছরের ঐতিহ্যে মতিঝিলের সবচেয়ে জনপ্রিয় খাসির ভুনা খিচুড়ি ও কাচ্চি!' },
    announcementEn: { type: String, default: '50+ Years of heritage! Dhaka’s favorite Mutton Khichuri & Kacchi.' },
    isAnnouncementActive: { type: Boolean, default: true },
    googleMapsUrl: {
      type: String,
      default: 'https://maps.google.com/?q=9/C+Motijheel+C/A+Dhaka',
    },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com/gharowahotel' },
      instagram: { type: String, default: 'https://instagram.com/gharowarestaurant' },
      youtube: { type: String, default: 'https://youtube.com/@gharowarestaurant' },
    },
    // Hero Defaults
    heroTitleBn: { type: String, default: 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি' },
    heroTitleEn: { type: String, default: 'MUTTON KHICHURI' },
    heroSubtitleBn: { type: String, default: 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।' },
    heroSubtitleEn: { type: String, default: 'Traditional taste, rich aroma and perfectly cooked mutton.' },
    heroBadgeBn: { type: String, default: 'খাঁটি ও ঐতিহ্যবাহী' },
    heroBadgeEn: { type: String, default: 'AUTHENTIC' },
    heroImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop' },
    heroPouringImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop' },
    heroBgPatternUrl: { type: String, default: '' },
    heroCtaTextBn: { type: String, default: 'অর্ডার করুন' },
    heroCtaTextEn: { type: String, default: 'Order Now' },
    heroCtaLink: { type: String, default: '/menu' },
    // About Defaults
    aboutTitleBn: { type: String, default: 'আমাদের গল্প' },
    aboutTitleEn: { type: String, default: 'Our Story' },
    aboutDescBn: { type: String, default: '১৯৭২ সাল থেকে ঢাকার মতিঝিলের প্রাণকেন্দ্রে খাঁটি ঐতিহ্যবাহী স্বাদের বিশ্বস্ত ঠিকানা। খাসির ভুনা খিচুড়ি ও কাচ্চির ঐতিহ্যে আমরা আপসহীন।' },
    aboutDescEn: { type: String, default: 'Gharowa Hotel & Restaurant started in 1972 with a simple goal — to serve authentic Bengali flavors with the highest quality and love. Our Mutton Khichuri is our signature dish loved by thousands.' },
    aboutImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop' },
    aboutStats: {
      type: [
        {
          labelBn: String,
          labelEn: String,
          value: String,
        },
      ],
      default: [
        { labelBn: 'বছরের অভিজ্ঞতা', labelEn: 'Years Experience', value: '10+' },
        { labelBn: 'সন্তুষ্ট গ্রাহক', labelEn: 'Happy Customers', value: '50K+' },
        { labelBn: 'তাজা উপাদান', labelEn: 'Fresh Ingredients', value: '100%' },
        { labelBn: 'গ্রাহক রেটিং', labelEn: 'Customer Rating', value: '4.9 ★' },
      ],
    },
    // Chef Defaults
    chefName: { type: String, default: 'Chef Rahman' },
    chefDesignation: { type: String, default: 'Executive Master Chef' },
    chefBioBn: { type: String, default: '২৫ বছরেরও বেশি রন্ধন অভিজ্ঞতায় ঐতিহ্যবাহী মসলা ও খাঁটি ঘরোয়া স্বাদের ধারক।' },
    chefBioEn: { type: String, default: 'Over 25 years of mastery in authentic slow-cooked traditional Bangladeshi heritage cuisine.' },
    chefExperience: { type: String, default: '25+ Years Experience' },
    chefSpecialty: { type: String, default: 'Dum Pukht & Heritage Khichuri' },
    chefImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop' },
    // Owner Defaults
    ownerName: { type: String, default: 'Alhaj Md. Sirajuddin' },
    ownerDesignation: { type: String, default: 'Founder & Visionary' },
    ownerStoryBn: { type: String, default: '১৯৭২ সালে মতিঝিলে ছোট্ট পরিসরে শুরু করা ঘরোয়া আজ ঢাকার ঐতিহ্যের অংশ। আমাদের অঙ্গীকার কেবল মান ও খাঁটি স্বাদ।' },
    ownerStoryEn: { type: String, default: 'Founded with the philosophy that great food brings families and hearts together with honesty and passion.' },
    ownerQuoteBn: { type: String, default: 'স্বাদ যেখানে স্মৃতি, তৃপ্তি যেখানে প্রতিশ্রুতি।' },
    ownerQuoteEn: { type: String, default: 'Where culinary tradition meets timeless hospitality.' },
    ownerImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' },
    // Popular Dishes CMS
    popularDishesTitleBn: { type: String, default: 'ঘরোয়ার সবচেয়ে জনপ্রিয় খাবার' },
    popularDishesTitleEn: { type: String, default: 'Most Popular Dishes' },
    popularDishesSubtitleBn: { type: String, default: 'প্রতিদিন শত শত ভোজনরসিকের প্রথম পছন্দ মতিঝিলের ঐতিহ্যবাহী স্পেশাল আইটেম' },
    popularDishesSubtitleEn: { type: String, default: 'Our daily signature dishes crafted with traditional spice blends' },
    isPopularDishesEnabled: { type: Boolean, default: true },
    // Footer & Branding CMS
    footerDescriptionBn: { type: String, default: '১৯৭২ সাল থেকে ঢাকার মতিঝিলের বাণিজ্যিক হৃদয়ে ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি ও কাচ্চির বিশ্বস্ত ঠিকানা।' },
    footerDescriptionEn: { type: String, default: 'Authentic 1972 Bengali heritage cuisine in Motijheel, Dhaka. Famous for legendary Mutton Khichuri & Kacchi.' },
    copyrightTextBn: { type: String, default: '© ১৯৭২-২০২৬ ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট। সর্বস্বত্ব সংরক্ষিত।' },
    copyrightTextEn: { type: String, default: '© 1972-2026 Gharowa Hotel & Restaurant. All Rights Reserved.' },
    // SEO & OpenGraph
    seoTitle: { type: String, default: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট | Gharowa Hotel & Restaurant (Since 1972)' },
    seoDescription: { type: String, default: '১৯৭২ সাল থেকে মতিঝিল ঢাকার সেরা ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, কাচ্চি ও খাঁটি বাংলা খাবার।' },
    ogTitle: { type: String, default: 'Gharowa Hotel & Restaurant (Since 1972) - Motijheel, Dhaka' },
    ogDescription: { type: String, default: 'Order authentic 1972 Mutton Khichuri, Kacchi & traditional Bengali delicacies in Dhaka.' },
    ogImageUrl: { type: String, default: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop' },
  },
  { timestamps: true }
);

export const RestaurantSettings = mongoose.model<IRestaurantSettings>(
  'RestaurantSettings',
  RestaurantSettingsSchema
);
