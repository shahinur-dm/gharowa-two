import mongoose from 'mongoose';
import { config } from '../config';
import { connectDB } from '../config/db';
import { User, MenuCategory, MenuItem, Coupon, RestaurantSettings, InventoryItem } from '../models';

export const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed Admin User
    console.log('[Seed] Seeding Admin User...');
    await User.deleteMany({ email: config.adminDefaultEmail.toLowerCase() });
    const admin = await User.create({
      name: 'Gharowa Head Admin',
      email: config.adminDefaultEmail.toLowerCase(),
      password: config.adminDefaultPassword,
      phone: '01973255888',
      role: 'super_admin',
      isActive: true,
    });
    console.log(`[Seed] Super Admin created: ${admin.email}`);

    // Create a demo Kitchen Staff user
    await User.deleteMany({ email: 'kitchen@gharowa.com' });
    await User.create({
      name: 'Motijheel Head Chef',
      email: 'kitchen@gharowa.com',
      password: 'Kitchen@Gharowa1972',
      phone: '01973255889',
      role: 'kitchen_staff',
      isActive: true,
    });

    // 2. Seed Categories
    console.log('[Seed] Seeding Menu Categories...');
    await MenuCategory.deleteMany({});
    const categoriesData = [
      { nameBn: 'দুপুর ও রাত', nameEn: 'Lunch & Dinner', slug: 'lunch-dinner', displayOrder: 1, icon: 'Utensils' },
      { nameBn: 'সকালের নাস্তা', nameEn: 'Breakfast', slug: 'breakfast', displayOrder: 2, icon: 'Sun' },
      { nameBn: 'মাছ', nameEn: 'Fish Special', slug: 'fish', displayOrder: 3, icon: 'Fish' },
      { nameBn: 'কাবাব ও শর্মা', nameEn: 'Kebab & Grills', slug: 'kebab', displayOrder: 4, icon: 'Flame' },
      { nameBn: 'ডেজার্ট', nameEn: 'Desserts', slug: 'dessert', displayOrder: 5, icon: 'Cake' },
      { nameBn: 'পানীয়', nameEn: 'Beverages', slug: 'beverages', displayOrder: 6, icon: 'Coffee' },
    ];
    const createdCategories = await MenuCategory.insertMany(categoriesData);
    const catMap: { [slug: string]: mongoose.Types.ObjectId } = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id as mongoose.Types.ObjectId;
    });

    // 3. Seed Menu Items
    console.log('[Seed] Seeding Menu Items...');
    await MenuItem.deleteMany({});
    const menuItemsData = [
      {
        nameBn: 'খাসির ভুনা খিচুড়ি',
        nameEn: 'Mutton Bhuna Khichuri',
        slug: 'mutton-bhuna-khichuri',
        category: catMap['lunch-dinner'],
        price: 290,
        originalPrice: 320,
        descriptionBn: '১৯৭২ সালের ঐতিহ্যবাহী গোপন মসলায় রান্না করা খাঁটি দেশি খাসির মাংসের তুলতুলে ভুনা খিচুড়ি।',
        descriptionEn: 'Heritage slow-cooked tender mutton prepared with Gharowa’s secret 1972 spice blend and fragrant chinigura rice.',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 15,
        dietaryTags: ['Heritage Special', 'Chef Choice', 'Halal'],
        displayOrder: 1,
      },
      {
        nameBn: 'খাসির লেগ খিচুড়ি',
        nameEn: 'Mutton Leg Khichuri',
        slug: 'mutton-leg-khichuri',
        category: catMap['lunch-dinner'],
        price: 550,
        originalPrice: 600,
        descriptionBn: 'প্রিমিয়াম আস্ত খাসির রানের রসালো নরম মাংসসহ ঐতিহ্যবাহী ঘরোয়া ঘি খিচুড়ি।',
        descriptionEn: 'Juicy whole mutton shank slow-braised to perfection, served over aromatic ghee-infused khichuri.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 20,
        dietaryTags: ['Signature Platter', 'Premium Lamb', 'Halal'],
        displayOrder: 2,
      },
      {
        nameBn: 'স্পেশাল খাসির কাচ্চি',
        nameEn: 'Special Mutton Kacchi Biryani',
        slug: 'special-mutton-kacchi',
        category: catMap['lunch-dinner'],
        price: 290,
        originalPrice: 330,
        descriptionBn: 'সুগন্ধি বাসমতী চাল, আলু বোখারা ও খাঁটি ঘিয়ে মেরিনেট করা খাসির মাংসের খাঁটি কাচ্চি। সঙ্গে ডিম ও আলু।',
        descriptionEn: 'Authentic Dhaka-style slow dum mutton kacchi biryani infused with pure saffron, ghee, baby potato and egg.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 15,
        dietaryTags: ['Top Seller', 'Halal', 'Dum Biryani'],
        displayOrder: 3,
      },
      {
        nameBn: 'চিকেন ভুনা খিচুড়ি',
        nameEn: 'Chicken Bhuna Khichuri',
        slug: 'chicken-bhuna-khichuri',
        category: catMap['lunch-dinner'],
        price: 250,
        originalPrice: 280,
        descriptionBn: 'দেশি স্বাদের কড়া ভুনা মুরগির মাংসের সাথে সুস্বাদু চাল-ডালের গরম খিচুড়ি।',
        descriptionEn: 'Rich, comforting Bangladeshi yellow khichuri served with deeply spiced chicken bhuna.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 12,
        dietaryTags: ['Chicken Special', 'Halal'],
        displayOrder: 4,
      },
      {
        nameBn: 'খাসির পায়া নেহারী',
        nameEn: 'Mutton Paya Nehari',
        slug: 'mutton-paya-nehari',
        category: catMap['breakfast'],
        price: 150,
        originalPrice: 180,
        descriptionBn: 'সারারাত ধিমে আঁচে সেদ্ধ করা খাসির পায়ার ঘন ঝোল ও আদা-লেবুর সুগন্ধি নেহারী। সকালের সেরা নাস্তা।',
        descriptionEn: 'Overnight slow-simmered rich mutton trotters broth served with fresh ginger slivers, coriander, and green chillies.',
        image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 3,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 10,
        dietaryTags: ['Breakfast Special', 'Heritage Stew', 'Halal'],
        displayOrder: 5,
      },
      {
        nameBn: 'স্পেশাল সরিষা ইলিশ',
        nameEn: 'Special Shorshe Ilish (Hilsa)',
        slug: 'special-shorshe-ilish',
        category: catMap['fish'],
        price: 500,
        originalPrice: 550,
        descriptionBn: 'পদ্মার খাঁটি তাজা ইলিশের পেটি ও খাঁটি সরিষা বাটার ঝাঁঝালো ঐতিহ্যের স্বাদ।',
        descriptionEn: 'Fresh Padma River Hilsa steak simmered in pungent freshly ground mustard paste and green chillies.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 20,
        dietaryTags: ['Padma Hilsa', 'Traditional Fish', 'Gluten Free'],
        displayOrder: 6,
      },
      {
        nameBn: 'রূপচাঁদা ফ্রাই',
        nameEn: 'Rupchanda (Pomfret) Fish Fry',
        slug: 'rupchanda-fry',
        category: catMap['fish'],
        price: 350,
        originalPrice: 400,
        descriptionBn: 'মচমচে রূপচাঁদা মাছ ফ্রাই, সাথে বিশেষ টক-মিষ্টি সালাদ ও পুদিনা চাটনি।',
        descriptionEn: 'Whole Silver Pomfret marinated in coastal spices and shallow-fried golden crisp.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 15,
        dietaryTags: ['Seafood', 'Crispy Fry'],
        displayOrder: 7,
      },
      {
        nameBn: 'চিকেন বটি কাবাব',
        nameEn: 'Chicken Boti Kebab',
        slug: 'chicken-boti-kebab',
        category: catMap['kebab'],
        price: 150,
        originalPrice: 170,
        descriptionBn: 'কয়লার আগুনে পোড়ানো নরম রসালো মুরগির মাংসের সুস্বাদু বটি কাবাব।',
        descriptionEn: 'Boneless chicken cubes marinated in yogurt and charred on charcoal skewers.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: false,
        preparationTimeMinutes: 15,
        dietaryTags: ['Charcoal Grill', 'High Protein', 'Halal'],
        displayOrder: 8,
      },
      {
        nameBn: 'স্পেশাল বোরহানি',
        nameEn: 'Gharowa Special Borhani',
        slug: 'gharowa-special-borhani',
        category: catMap['beverages'],
        price: 50,
        originalPrice: 60,
        descriptionBn: 'টক দই, পুদিনা পাতা, বিট লবণ ও বিশেষ মশলায় তৈরি ঢাকার আসল ঐতিহ্যের বোরহানি।',
        descriptionEn: 'Dhaka’s legendary spiced yogurt digestive drink crafted with fresh mint, coriander and toasted spices.',
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 5,
        dietaryTags: ['Digestive', 'House Special Drink', 'Vegetarian'],
        displayOrder: 9,
      },
      {
        nameBn: 'স্পেশাল ফিরনি',
        nameEn: 'Gharowa Special Firni',
        slug: 'special-firni',
        category: catMap['dessert'],
        price: 45,
        originalPrice: 50,
        descriptionBn: 'মাটির পাত্রে জমানো ঘন দুধের জাফরানি সুগন্ধি ফিরনি, পেস্তা ও কাজুবাদামের কুচি সহ।',
        descriptionEn: 'Rich slow-reduced saffron rice pudding served chilled in traditional clay pot with pistachio slivers.',
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
        spiceLevel: 0,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 5,
        dietaryTags: ['Sweet Dessert', 'Clay Pot', 'Vegetarian'],
        displayOrder: 10,
      },
    ];
    await MenuItem.insertMany(menuItemsData);
    console.log(`[Seed] Seeded ${menuItemsData.length} menu items`);

    // 4. Seed Coupons
    console.log('[Seed] Seeding Coupons...');
    await Coupon.deleteMany({});
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 2);
    await Coupon.insertMany([
      {
        code: 'GH1972',
        titleBn: '১৯৭২ ঐতিহ্য উৎসব ডিসকাউন্ট',
        titleEn: '1972 Heritage Celebration Discount',
        descriptionBn: 'যেকোনো অর্ডারে ১০% ছাড় (সর্বোচ্চ ১০০ টাকা পর্যন্ত)',
        descriptionEn: '10% discount on all orders up to ৳100',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 300,
        maxDiscountAmount: 100,
        expiryDate: nextYear,
        isActive: true,
      },
      {
        code: 'MOTIJHEEL50',
        titleBn: 'মতিঝিল কর্পোরেট ফ্ল্যাট ৫০ টাকা ছাড়',
        titleEn: 'Motijheel Corporate Flat ৳50 OFF',
        descriptionBn: '৫০০ টাকার অর্ডারে সরাসরি ৫০ টাকা ছাড়',
        descriptionEn: 'Flat ৳50 off on orders above ৳500',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 500,
        expiryDate: nextYear,
        isActive: true,
      },
    ]);

    // 5. Seed Inventory Items
    console.log('[Seed] Seeding Raw Inventory items...');
    await InventoryItem.deleteMany({});
    await InventoryItem.insertMany([
      {
        nameBn: 'দেশি খাসির মাংস',
        nameEn: 'Fresh Mutton Meat',
        category: 'meat_poultry',
        unit: 'kg',
        currentStock: 45,
        minStockThreshold: 15,
        costPerUnit: 950,
        supplier: 'কাপ্তান বাজার খাসি সাপ্লাইয়ার',
      },
      {
        nameBn: 'চিনিগুঁড়া সুগন্ধি চাল',
        nameEn: 'Chinigura Aromatic Rice',
        category: 'rice_grains',
        unit: 'kg',
        currentStock: 120,
        minStockThreshold: 30,
        costPerUnit: 140,
        supplier: 'দিনাজপুর অটো রাইস মিল',
      },
      {
        nameBn: 'খাঁটি গাওয়া ঘি',
        nameEn: 'Pure Desi Ghee',
        category: 'spices_oil',
        unit: 'kg',
        currentStock: 25,
        minStockThreshold: 10,
        costPerUnit: 1200,
        supplier: 'পাবনা দুগ্ধ ভান্ডার',
      },
      {
        nameBn: 'পদ্মার তাজা ইলিশ',
        nameEn: 'Padma Fresh Hilsa',
        category: 'fish',
        unit: 'piece',
        currentStock: 18,
        minStockThreshold: 8,
        costPerUnit: 900,
        supplier: 'মাওয়া ঘাট ফিশারি',
      },
      {
        nameBn: 'টক দই (বোরহানির জন্য)',
        nameEn: 'Sour Curd (For Borhani)',
        category: 'dairy_beverage',
        unit: 'kg',
        currentStock: 30,
        minStockThreshold: 12,
        costPerUnit: 160,
        supplier: 'আড়ং ডেইরি',
      },
      {
        nameBn: 'টেকওয়ে ফুড বক্স (১ কেজি)',
        nameEn: 'Takeaway Food Box 1kg',
        category: 'packaging',
        unit: 'piece',
        currentStock: 450,
        minStockThreshold: 100,
        costPerUnit: 12,
        supplier: 'চকবাজার প্লাস্টিক ও পেপার হাউস',
      },
    ]);

    // 6. Seed Restaurant Settings
    console.log('[Seed] Seeding Restaurant Settings...');
    await RestaurantSettings.deleteMany({});
    await RestaurantSettings.create({
      restaurantNameBn: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট',
      restaurantNameEn: 'Gharowa Hotel & Restaurant',
      taglineBn: '১৯৭২ থেকে ঢাকার হৃদয়ে ঐতিহ্যের স্বাদ',
      taglineEn: '50+ Years of Authentic Heritage in Motijheel, Dhaka',
      establishedYear: 1972,
      phone: '01973255888',
      whatsappNumber: '8801973255888',
      email: 'info@gharowarestaurant.com',
      addressBn: '৯/সি মতিঝিল বা/এ, ঢাকা-১০০০',
      addressEn: '9/C Motijheel C/A, Dhaka-1000',
      landmarkBn: 'মতিঝিল মেট্রোরেল স্টেশন ও শাপলা চত্বর সংলগ্ন',
      landmarkEn: 'Next to Motijheel Metro Station & Shapla Chottor',
      openingHoursBn: 'সকাল ৭:০০ - রাত ১১:৩০ (প্রতিদিন)',
      openingHoursEn: '7:00 AM - 11:30 PM (Everyday)',
      standardDeliveryFee: 60,
      freeDeliveryThreshold: 1500,
      minOrderAmount: 150,
      isOnlineOrderActive: true,
      announcementBn: '৫০+ বছরের ঐতিহ্যে মতিঝিলের সবচেয়ে জনপ্রিয় খাসির ভুনা খিচুড়ি ও কাচ্চি এখন আপনার দরজায়!',
      announcementEn: '50+ Years of heritage taste! Dhaka’s favorite Mutton Khichuri delivered to your doorstep.',
      isAnnouncementActive: true,
      googleMapsUrl: 'https://maps.google.com/?q=9/C+Motijheel+C/A+Dhaka',
      socialLinks: {
        facebook: 'https://facebook.com/gharowahotel',
        instagram: 'https://instagram.com/gharowarestaurant',
        youtube: 'https://youtube.com/@gharowarestaurant',
      },
    });

    console.log('[Seed] Database seeding completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedDatabase();
}
