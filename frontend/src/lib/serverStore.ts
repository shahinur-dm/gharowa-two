// Shared In-Memory / Serverless Store for Standalone Vercel & API Route Handlers

export interface CategoryData {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  descriptionBn?: string;
  descriptionEn?: string;
  image?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface MenuItemData {
  _id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  sku?: string;
  category: CategoryData | string;
  price: number;
  originalPrice?: number;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  galleryImages?: string[];
  spiceLevel: number;
  isAvailable: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  preparationTimeMinutes: number;
  servingSize?: string;
  ingredients?: string[];
  dietaryTags?: string[];
  displayOrder: number;
  rating?: number;
  reviewsCount?: number;
}

export const initialCategories: CategoryData[] = [
  {
    _id: 'cat-khichuri-biryani',
    nameBn: 'খিচুড়ি ও বিরিয়ানি',
    nameEn: 'Khichuri & Biryani',
    slug: 'khichuri-biryani',
    descriptionBn: 'ঘরোয়ার ৫০ বছরের ঐতিহ্যবাহী গোপন মসলায় তৈরি সিগনেচার খিচুড়ি ও কাচ্চি',
    descriptionEn: 'Gharowa signature mutton khichuri and kacchi biryani',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    icon: 'Flame',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: 'cat-breakfast',
    nameBn: 'সকালের নাস্তা',
    nameEn: 'Breakfast',
    slug: 'breakfast',
    descriptionBn: 'সকালের গরম গরম পাতলা নান, পরটা, ভাজি, পায়া ও নেহারী',
    descriptionEn: 'Fresh breakfast naans, parathas, bhaji and paya nehari',
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop',
    icon: 'Sun',
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: 'cat-main-course',
    nameBn: 'দুপুর ও রাতের খাবার',
    nameEn: 'Lunch & Dinner',
    slug: 'main-course',
    descriptionBn: 'খাসির দো-পিয়াজো, চিকেন মোসাল্লাম, রোস্ট ও নানা পদের মাংস',
    descriptionEn: 'Mutton do-pyaza, chicken musallam and hearty meat dishes',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    icon: 'Utensils',
    displayOrder: 3,
    isActive: true,
  },
  {
    _id: 'cat-fish',
    nameBn: 'মাছের পদ',
    nameEn: 'Fish Special',
    slug: 'fish',
    descriptionBn: 'পদ্মার খাঁটি সরিষা ইলিশ, রূপচাঁদা ফ্রাই ও রুই মাছ',
    descriptionEn: 'Authentic Padma shorshe ilish, rupchanda fry and rui fish curry',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
    icon: 'Fish',
    displayOrder: 4,
    isActive: true,
  },
  {
    _id: 'cat-kabab-grill',
    nameBn: 'কাবাব ও শর্মা',
    nameEn: 'Kebab & Shawarma',
    slug: 'kabab-grill',
    descriptionBn: 'কয়লার আগুনে পোড়ানো চিকেন ও খাসির কাবাব, শর্মা ও হালিম',
    descriptionEn: 'Charcoal grilled kebabs, spicy shawarmas and rich royal haleem',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
    icon: 'Flame',
    displayOrder: 5,
    isActive: true,
  },
  {
    _id: 'cat-vorta-greens',
    nameBn: 'শাক ও ভর্তা',
    nameEn: 'Vorta & Greens',
    slug: 'vorta-greens',
    descriptionBn: 'দেশি লাল শাক, বেগুন ভর্তা, কলা ভর্তা, মাছ ভর্তা ও করলা ভাজি',
    descriptionEn: 'Traditional Bangladeshi mashed vortas and fresh green fries',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
    icon: 'Leaf',
    displayOrder: 6,
    isActive: true,
  },
  {
    _id: 'cat-breads-rice',
    nameBn: 'নান, পরটা ও ভাত',
    nameEn: 'Breads & Rice',
    slug: 'breads-rice',
    descriptionBn: 'গার্লিক নান, স্পেশাল পরটা ও সাদা পোলাও-ভাত',
    descriptionEn: 'Garlic naan, special tandoori paratha and steamed rice',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop',
    icon: 'Wheat',
    displayOrder: 7,
    isActive: true,
  },
  {
    _id: 'cat-desserts',
    nameBn: 'ডেজার্ট ও মিষ্টি',
    nameEn: 'Desserts & Sweets',
    slug: 'desserts',
    descriptionBn: 'ঐতিহ্যবাহী ফিরনি, ফালুদা, মালাই চপ ও বগুড়ার মিষ্টি দই',
    descriptionEn: 'Traditional saffron firni, royal falooda and sweet curd',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop',
    icon: 'Cake',
    displayOrder: 8,
    isActive: true,
  },
  {
    _id: 'cat-drinks',
    nameBn: 'পানীয় ও বোরহানি',
    nameEn: 'Drinks & Juices',
    slug: 'drinks',
    descriptionBn: 'ঘরোয়ার স্পেশাল শাহী বোরহানি, লাচ্ছি ও ফ্রেশ ফলের জুস',
    descriptionEn: 'Gharowa signature borhani, sweet lassi and fresh juices',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    icon: 'Coffee',
    displayOrder: 9,
    isActive: true,
  },
];

export const initialMenuItems: MenuItemData[] = [
  {
    _id: 'item-mutton-khichuri',
    nameBn: 'খাসির ভুনা খিচুড়ি',
    nameEn: 'Mutton Bhuna Khichuri',
    slug: 'mutton-khichuri',
    sku: 'GH-MUTC-001',
    category: initialCategories[0],
    price: 290,
    originalPrice: 330,
    descriptionBn: 'ঘরোয়ার সিগনেচার পদ — ১৯৭২ সাল থেকে ঐতিহ্যবাহী গোপন মসলায় রান্না করা খাঁটি দেশি খাসির মাংসের নরম ভুনা খিচুড়ি।',
    descriptionEn: 'Gharowa signature dish — fragrant chinigura rice slow-cooked with tender mutton pieces in pure ghee and 1972 secret spices.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    ],
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    isPopular: true,
    preparationTimeMinutes: 15,
    servingSize: '১ জন (1 Person)',
    ingredients: ['Chinigura Rice', 'Mutton', 'Pure Ghee', 'Roasted Moong Dal', 'Secret Spices'],
    dietaryTags: ['Heritage Special', 'Best Seller', '100% Halal'],
    displayOrder: 1,
    rating: 4.9,
    reviewsCount: 124,
  },
  {
    _id: 'item-mutton-leg-khichuri',
    nameBn: 'খাসির লেগ খিচুড়ি',
    nameEn: 'Special Mutton Leg Khichuri',
    slug: 'mutton-leg-khichuri',
    sku: 'GH-MLEG-002',
    category: initialCategories[0],
    price: 550,
    originalPrice: 600,
    descriptionBn: 'প্রিমিয়াম আস্ত খাসির রানের রসালো নরম মাংসসহ ঐতিহ্যবাহী ঘরোয়া ঘি খিচুড়ি।',
    descriptionEn: 'Whole tender mutton leg shank braised in rich spices, served over aromatic ghee khichuri.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    isPopular: true,
    preparationTimeMinutes: 20,
    servingSize: '১-২ জন (1-2 Person)',
    dietaryTags: ['Signature Platter', 'Chef Choice'],
    displayOrder: 2,
    rating: 5.0,
    reviewsCount: 98,
  },
  {
    _id: 'item-mutton-kacchi',
    nameBn: 'স্পেশাল খাসির কাচ্চি',
    nameEn: 'Special Mutton Kacchi Biryani',
    slug: 'special-mutton-kacchi',
    sku: 'GH-MKAC-003',
    category: initialCategories[0],
    price: 290,
    originalPrice: 330,
    descriptionBn: 'সুগন্ধি বাসমতী চাল, আলু বোখারা ও খাঁটি ঘিয়ে মেরিনেট করা খাসির মাংসের খাঁটি কাচ্চি।',
    descriptionEn: 'Authentic Dhaka-style slow dum mutton kacchi biryani infused with pure saffron and ghee.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    isPopular: true,
    preparationTimeMinutes: 15,
    servingSize: '১ জন (1 Person)',
    dietaryTags: ['Top Seller', 'Dum Biryani'],
    displayOrder: 3,
    rating: 4.9,
    reviewsCount: 145,
  },
  {
    _id: 'item-chicken-biryani',
    nameBn: 'স্পেশাল চিকেন বিরিয়ানি',
    nameEn: 'Special Chicken Biryani',
    slug: 'special-chicken-biryani',
    sku: 'GH-CBIR-004',
    category: initialCategories[0],
    price: 240,
    originalPrice: 270,
    descriptionBn: 'রসালো চিকেন পিস, সুগন্ধি চাল ও মৃদু মসলায় তৈরি স্পেশাল চিকেন বিরিয়ানি।',
    descriptionEn: 'Fragrant long-grain rice layered with spiced chicken and golden roasted potatoes.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: false,
    isFeatured: true,
    isPopular: true,
    preparationTimeMinutes: 12,
    servingSize: '১ জন (1 Person)',
    displayOrder: 4,
    rating: 4.8,
    reviewsCount: 88,
  },
  {
    _id: 'item-shorshe-ilish',
    nameBn: 'স্পেশাল সরিষা ইলিশ',
    nameEn: 'Special Shorshe Ilish',
    slug: 'special-shorshe-ilish',
    sku: 'GH-ILIS-005',
    category: initialCategories[3],
    price: 500,
    originalPrice: 550,
    descriptionBn: 'পদ্মার তাজা বড় ইলিশের টুকরো খাঁটি সরিষার তেলে কাঁচামরিচ দিয়ে রান্না।',
    descriptionEn: 'Prime cut fresh Padma River Hilsa cooked in authentic pungent mustard gravy.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    isPopular: true,
    preparationTimeMinutes: 15,
    servingSize: '১ জন (1 Person)',
    displayOrder: 5,
    rating: 4.9,
    reviewsCount: 76,
  },
  {
    _id: 'item-borhani-glass',
    nameBn: 'স্পেশাল বোরহানি (প্রতি গ্লাস)',
    nameEn: 'Special Borhani (Glass)',
    slug: 'special-borhani-glass',
    sku: 'GH-BORH-006',
    category: initialCategories[8],
    price: 50,
    descriptionBn: 'টক দই, পুদিনা পাতা, ধনেপাতা ও বিশেষ মশলায় তৈরি রিফ্রেশিং বোরহানি।',
    descriptionEn: 'Traditional digestive yogurt drink blended with mint, coriander, and royal spices.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 1,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    isPopular: true,
    preparationTimeMinutes: 2,
    servingSize: '২৫০ মি.লি. (250ml)',
    displayOrder: 6,
    rating: 4.9,
    reviewsCount: 210,
  },
];

export const defaultSettings = {
  logoUrl: '',
  faviconUrl: '',
  restaurantNameBn: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট',
  restaurantNameEn: 'Gharowa Hotel & Restaurant',
  taglineBn: '১৯৭২ সাল থেকে মতিঝিলের ঐতিহ্যের আসল স্বাদ',
  taglineEn: '50+ Years of Authentic Culinary Heritage in Motijheel',
  establishedYear: 1972,
  phone: '01973255888',
  whatsappNumber: '01973255888',
  whatsappCountryCode: '+880',
  isWhatsAppOrderActive: true,
  whatsappOrderTemplate: `Hello Gharowa Hotel & Restaurant (Since 1972),\n\nI would like to place an order from your website:\n\n🍛 Food: {{product_name}}\n🔢 Quantity: {{quantity}}\n💰 Unit Price: ৳{{price}}\n💵 Total: ৳{{total}}\n\nPlease confirm availability and delivery details. Thank you!`,
  email: 'info@gharowa.com',
  addressBn: '৯/সি, মতিঝিল বা/এ (মেট্রোরেল স্টেশনের সন্নিকটে), ঢাকা-১০০০',
  addressEn: '9/C Motijheel C/A (Near Metro Station), Dhaka-1000',
  openingHoursBn: 'প্রতিদিন সকাল ৭:০০ - রাত ১১:৩০',
  openingHoursEn: 'Everyday 7:00 AM - 11:30 PM',
  standardDeliveryFee: 60,
  freeDeliveryThreshold: 1000,
  minOrderAmount: 150,
  isOnlineOrderActive: true,
  heroTitleBn: 'ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি',
  heroTitleEn: 'MUTTON KHICHURI',
  heroSubtitleBn: 'আসল স্বাদ, মোহময় সুবাস ও নিপুণভাবে রান্না করা খাসির নরম মাংস।',
  heroSubtitleEn: 'Traditional taste, rich aroma and perfectly cooked mutton.',
  heroBadgeBn: 'খাঁটি ও ঐতিহ্যবাহী',
  heroBadgeEn: 'AUTHENTIC',
  heroImageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop',
  heroPouringImageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
  heroCtaTextBn: 'অর্ডার করুন',
  heroCtaTextEn: 'Order Now',
  heroCtaLink: '/menu',
  seoTitle: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972) — মতিঝিল, ঢাকা',
  seoDescription: '১৯৭২ সাল থেকে ঢাকার মতিঝিলের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, স্পেশাল কাচ্চি ও বোরহানি।',
  ogTitle: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972) — মতিঝিল, ঢাকা',
  ogDescription: '১৯৭২ সাল থেকে মতিঝিলের খাঁটি খাসির ভুনা খিচুড়ি ও কাচ্চির আসল ঠিকানা।',
  ogImageUrl: '',
};

// In-Memory Storage Instances
let globalCategories: CategoryData[] = [...initialCategories];
let globalMenuItems: MenuItemData[] = [...initialMenuItems];
let globalSettings = { ...defaultSettings };

export const getStoreCategories = () => globalCategories;
export const setStoreCategories = (cats: CategoryData[]) => {
  globalCategories = cats;
};

export const addStoreCategory = (cat: CategoryData) => {
  globalCategories.push(cat);
  return cat;
};

export const updateStoreCategory = (id: string, updates: Partial<CategoryData>) => {
  const idx = globalCategories.findIndex((c) => c._id === id);
  if (idx !== -1) {
    globalCategories[idx] = { ...globalCategories[idx], ...updates };
    return globalCategories[idx];
  }
  return null;
};

export const deleteStoreCategory = (id: string) => {
  globalCategories = globalCategories.filter((c) => c._id !== id);
  return true;
};

export const getStoreMenuItems = () => globalMenuItems;
export const addStoreMenuItem = (item: MenuItemData) => {
  globalMenuItems.push(item);
  return item;
};
export const updateStoreMenuItem = (id: string, updates: Partial<MenuItemData>) => {
  const idx = globalMenuItems.findIndex((i) => i._id === id);
  if (idx !== -1) {
    globalMenuItems[idx] = { ...globalMenuItems[idx], ...updates };
    return globalMenuItems[idx];
  }
  return null;
};
export const deleteStoreMenuItem = (id: string) => {
  globalMenuItems = globalMenuItems.filter((i) => i._id !== id);
  return true;
};

export const getStoreSettings = () => globalSettings;
export const updateStoreSettings = (updates: Partial<typeof defaultSettings>) => {
  globalSettings = { ...globalSettings, ...updates };
  return globalSettings;
};
