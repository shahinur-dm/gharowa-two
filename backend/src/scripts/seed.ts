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
      { nameBn: 'খিচুড়ি', nameEn: 'Khichuri', slug: 'khichuri', displayOrder: 1, icon: 'Flame', isActive: true },
      { nameBn: 'বিরিয়ানি ও তেহারি', nameEn: 'Biryani', slug: 'biryani', displayOrder: 2, icon: 'Utensils', isActive: true },
      { nameBn: 'পোলাও ও ভাত', nameEn: 'Rice', slug: 'rice', displayOrder: 3, icon: 'Wheat', isActive: true },
      { nameBn: 'খাসি স্পেশাল', nameEn: 'Mutton', slug: 'mutton', displayOrder: 4, icon: 'Flame', isActive: true },
      { nameBn: 'চিকেন স্পেশাল', nameEn: 'Chicken', slug: 'chicken', displayOrder: 5, icon: 'Utensils', isActive: true },
      { nameBn: 'বিফ স্পেশাল', nameEn: 'Beef', slug: 'beef', displayOrder: 6, icon: 'Flame', isActive: true },
      { nameBn: 'পানীয় ও বোরহানি', nameEn: 'Drinks', slug: 'drinks', displayOrder: 7, icon: 'Coffee', isActive: true },
      { nameBn: 'মিষ্টি ও ডেজার্ট', nameEn: 'Desserts', slug: 'desserts', displayOrder: 8, icon: 'Cake', isActive: true },
    ];
    const createdCategories = await MenuCategory.insertMany(categoriesData);
    const catMap: { [slug: string]: mongoose.Types.ObjectId } = {};
    createdCategories.forEach((c) => {
      catMap[c.slug] = c._id as mongoose.Types.ObjectId;
    });

    // 3. Seed 15 Realistic Demo Menu Items
    console.log('[Seed] Seeding 15 Realistic Demo Menu Items...');
    await MenuItem.deleteMany({});
    const menuItemsData = [
      // 1. Mutton Khichuri (Signature Bestseller)
      {
        nameBn: 'খাসির ভুনা খিচুড়ি',
        nameEn: 'Mutton Khichuri',
        slug: 'mutton-khichuri',
        category: catMap['khichuri'],
        price: 280,
        originalPrice: 320,
        descriptionBn: '১৯৭২ সালের ঐতিহ্যবাহী গোপন মসলায় রান্না করা খাঁটি দেশি খাসির মাংসের তুলতুলে ভুনা খিচুড়ি। সুগন্ধি চিনিগুঁড়া চাল ও খাঁটি গাওয়া ঘিয়ে তৈরি।',
        descriptionEn: 'Fragrant basmati and chinigura rice cooked with tender mutton, aromatic spices and rich flavors. A traditional Bengali favorite.',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 15,
        dietaryTags: ['Heritage Special', 'Best Seller', '100% Halal'],
        displayOrder: 1,
        rating: 4.9,
        reviewsCount: 124,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 280, servingSize: '1 Person' },
          { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 420, servingSize: '1-2 Person' },
          { nameBn: 'ফ্যামিলি (৩-৪ জন)', nameEn: 'Family (3-4 Person)', price: 820, servingSize: '3-4 Person' },
        ],
        addOns: [
          { nameBn: 'অতিরিক্ত খাসির মাংস', nameEn: 'Extra Mutton', price: 80 },
          { nameBn: 'অতিরিক্ত ডিম', nameEn: 'Extra Egg', price: 20 },
          { nameBn: 'সালাদ', nameEn: 'Salad', price: 30 },
          { nameBn: 'বোরহানি (২০০ মি.লি.)', nameEn: 'Borhani (200ml)', price: 50 },
        ],
        nutritionFacts: {
          calories: '450 kcal',
          protein: '18 g',
          carbs: '52 g',
          fat: '15 g',
          fiber: '2 g',
        },
        aboutDishBn: 'আমাদের খাসির ভুনা খিচুড়ি প্রিমিয়াম দেশি খাসি ও খাঁটি গাওয়া ঘি দিয়ে ঐতিহ্যবাহী পদ্ধতিতে তৈরি, যা প্রতি লোকমায় আনে অসাধারণ তৃপ্তি।',
        aboutDishEn: 'Our Mutton Khichuri is slow-cooked with premium rice, tender mutton, and a perfect blend of spices to give you the most authentic taste.',
      },

      // 2. Beef Tehari
      {
        nameBn: 'পুরান ঢাকার বিফ তেহারি',
        nameEn: 'Beef Tehari',
        slug: 'beef-tehari',
        category: catMap['beef'],
        price: 260,
        originalPrice: 290,
        descriptionBn: 'সরিষার তেলে রান্না করা ছোট ছোট নরম গরুর মাংসের টুকরা ও সুগন্ধি চালের খাঁটি ঢাকাইয়া তেহারি। সাথে কাঁচামরিচের সুবাস।',
        descriptionEn: 'Traditional Old Dhaka style mustard-oil infused aromatic rice layered with succulent spiced beef cubes and green chilies.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 15,
        dietaryTags: ['Old Dhaka Special', 'Mustard Oil', 'Halal'],
        displayOrder: 2,
        rating: 4.8,
        reviewsCount: 96,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 260, servingSize: '1 Person' },
          { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 390, servingSize: '1-2 Person' },
          { nameBn: 'ফ্যামিলি (৩-৪ জন)', nameEn: 'Family (3-4 Person)', price: 760, servingSize: '3-4 Person' },
        ],
        addOns: [
          { nameBn: 'অতিরিক্ত বিফ', nameEn: 'Extra Beef', price: 70 },
          { nameBn: 'অতিরিক্ত ডিম', nameEn: 'Extra Egg', price: 20 },
          { nameBn: 'শসা ও লেবুর সালাদ', nameEn: 'Salad', price: 30 },
          { nameBn: 'বোরহানি (২০০ মি.লি.)', nameEn: 'Borhani (200ml)', price: 50 },
        ],
        nutritionFacts: {
          calories: '480 kcal',
          protein: '22 g',
          carbs: '50 g',
          fat: '18 g',
          fiber: '2 g',
        },
        aboutDishBn: 'সরিষার তেলের ঝাঁজ ও গরুর মাংসের রসালো স্বাদে ভরপুর মতিঝিলের অন্যতম প্রিয় তেহারি।',
        aboutDishEn: 'Cooked in mustard oil with tender beef pieces, aromatic rice, and freshly pounded spices.',
      },

      // 3. Chicken Biryani
      {
        nameBn: 'চিকেন বিরিয়ানি',
        nameEn: 'Chicken Biryani',
        slug: 'chicken-biryani',
        category: catMap['biryani'],
        price: 250,
        originalPrice: 280,
        descriptionBn: 'রসালো রোস্টেড মুরগির বড় পিস, জাফরানি সুগন্ধি বাসমতী চাল ও সোনালী আলু দিয়ে প্রস্তুত ক্লাসিক বিরিয়ানি।',
        descriptionEn: 'Fragrant basmati rice cooked with succulent spiced chicken leg quarter, saffron, and tender golden potatoes.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 15,
        dietaryTags: ['Popular', 'Tender Chicken', 'Halal'],
        displayOrder: 3,
        rating: 4.7,
        reviewsCount: 88,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 250, servingSize: '1 Person' },
          { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 380, servingSize: '1-2 Person' },
          { nameBn: 'ফ্যামিলি (৩-৪ জন)', nameEn: 'Family (3-4 Person)', price: 740, servingSize: '3-4 Person' },
        ],
        addOns: [
          { nameBn: 'চিকেন রোস্ট পিস', nameEn: 'Extra Chicken Roast', price: 90 },
          { nameBn: 'অতিরিক্ত ডিম', nameEn: 'Extra Egg', price: 20 },
          { nameBn: 'বোরহানি', nameEn: 'Borhani', price: 50 },
        ],
        nutritionFacts: {
          calories: '420 kcal',
          protein: '24 g',
          carbs: '48 g',
          fat: '12 g',
          fiber: '1.5 g',
        },
        aboutDishBn: 'প্রতিটি মুরগির পিস সঠিকভাবে মেরিনেট করে ধিমে আঁচে রান্না করা হয়।',
        aboutDishEn: 'Delicious aromatic chicken biryani with flavorful saffron notes and tender meat.',
      },

      // 4. Mutton Biryani
      {
        nameBn: 'খাসির দম বিরিয়ানি',
        nameEn: 'Mutton Biryani',
        slug: 'mutton-biryani',
        category: catMap['mutton'],
        price: 300,
        originalPrice: 350,
        descriptionBn: 'মাটির হাঁড়িতে দমে রান্না করা সুগন্ধি জাফরানি বাসমতী চাল ও তুলতুলে খাসির মাংসের স্পেশাল বিরিয়ানি।',
        descriptionEn: 'Authentic dum-cooked mutton biryani layered with rich saffron rice, caramelised onions and succulent mutton.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 20,
        dietaryTags: ['Dum Pukht', 'Chef Special', 'Halal'],
        displayOrder: 4,
        rating: 4.7,
        reviewsCount: 77,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 300, servingSize: '1 Person' },
          { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 450, servingSize: '1-2 Person' },
          { nameBn: 'ফ্যামিলি (৩-৪ জন)', nameEn: 'Family (3-4 Person)', price: 880, servingSize: '3-4 Person' },
        ],
        addOns: [
          { nameBn: 'অতিরিক্ত খাসি', nameEn: 'Extra Mutton', price: 85 },
          { nameBn: 'অতিরিক্ত আলু ও ডিম', nameEn: 'Extra Potato & Egg', price: 30 },
          { nameBn: 'বোরহানি', nameEn: 'Borhani', price: 50 },
        ],
        nutritionFacts: {
          calories: '490 kcal',
          protein: '20 g',
          carbs: '54 g',
          fat: '18 g',
          fiber: '2 g',
        },
        aboutDishBn: 'দম রান্নার মাধ্যমে মাংসের প্রতিটি আঁশে মসলার নির্ভেজাল স্বাদ পৌঁছে যায়।',
        aboutDishEn: 'Dum-cooked to lock in all the rich flavors and aromas of spices and tender meat.',
      },

      // 5. Chicken Khichuri
      {
        nameBn: 'মুরগির ভুনা খিচুড়ি',
        nameEn: 'Chicken Khichuri',
        slug: 'chicken-khichuri',
        category: catMap['khichuri'],
        price: 220,
        originalPrice: 250,
        descriptionBn: 'ঘিয়ে ভাজা চিনিগুঁড়া চাল, সুস্বাদু মুগ ডাল ও রসালো মুরগির মাংসের ঐতিহ্যবাহী ভুনা খিচুড়ি।',
        descriptionEn: 'Homestyle khichuri made with chinigura rice, roasted yellow lentils and savory tender chicken pieces in ghee.',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: true,
        isFeatured: false,
        preparationTimeMinutes: 15,
        dietaryTags: ['Comfort Food', 'High Protein', 'Halal'],
        displayOrder: 5,
        rating: 4.8,
        reviewsCount: 78,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 220, servingSize: '1 Person' },
          { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 330, servingSize: '1-2 Person' },
        ],
        addOns: [
          { nameBn: 'অতিরিক্ত চিকেন', nameEn: 'Extra Chicken', price: 60 },
          { nameBn: 'ডিম ভাজি/সিদ্ধ', nameEn: 'Extra Egg', price: 20 },
          { nameBn: 'সালাদ', nameEn: 'Salad', price: 30 },
        ],
        nutritionFacts: {
          calories: '390 kcal',
          protein: '22 g',
          carbs: '46 g',
          fat: '11 g',
          fiber: '3 g',
        },
        aboutDishBn: 'হালকা মসলাযুক্ত ঘরোয়া স্বাদের খিচুড়ি যা প্রতিদিনের দুপুরের ভোজের জন্য সবচেয়ে উপযোগী।',
        aboutDishEn: 'Delicious comfort meal prepared with golden roasted lentils and tender chicken cubes.',
      },

      // 6. Beef Khichuri
      {
        nameBn: 'গরুর ভুনা খিচুড়ি',
        nameEn: 'Beef Khichuri',
        slug: 'beef-khichuri',
        category: catMap['beef'],
        price: 240,
        originalPrice: 270,
        descriptionBn: 'স্পেশাল কষা গরুর মাংসের ঘন গ্রেভি ও খাঁটি চাল-ডালের সংমিশ্রণে তৈরি লোভনীয় গরুর ভুনা খিচুড়ি।',
        descriptionEn: 'Mouthwatering bhuna khichuri tossed with slow-braised tender beef pieces in rich spiced onion gravy.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: true,
        isFeatured: false,
        preparationTimeMinutes: 15,
        dietaryTags: ['Traditional', 'Rich Flavor', 'Halal'],
        displayOrder: 6,
        rating: 4.9,
        reviewsCount: 88,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 240, servingSize: '1 Person' },
          { nameBn: 'লার্জ (১-২ জন)', nameEn: 'Large (1-2 Person)', price: 360, servingSize: '1-2 Person' },
        ],
        addOns: [
          { nameBn: 'অতিরিক্ত বিফ কষা', nameEn: 'Extra Beef', price: 70 },
          { nameBn: 'ডিম', nameEn: 'Extra Egg', price: 20 },
          { nameBn: 'বোরহানি', nameEn: 'Borhani', price: 50 },
        ],
        nutritionFacts: {
          calories: '460 kcal',
          protein: '24 g',
          carbs: '48 g',
          fat: '16 g',
          fiber: '2.5 g',
        },
        aboutDishBn: 'ঘরোয়ার গরুর ভুনা খিচুড়ি মতিঝিলের ভোজনরসিকদের বহু বছরের অন্যতম প্রিয় মেনু।',
        aboutDishEn: 'Rich, aromatic, and deeply satisfying with tender spiced beef.',
      },

      // 7. Mutton Rezala
      {
        nameBn: 'শাহী খাসির রেজালা',
        nameEn: 'Mutton Rezala',
        slug: 'mutton-rezala',
        category: catMap['mutton'],
        price: 320,
        originalPrice: 360,
        descriptionBn: 'কাজুবাদাম বাটা, পোস্তদানা, টক দই ও জাফরানি গ্রেভিতে রান্না করা ঐতিহ্যবাহী মোঘলাই খাসির রেজালা।',
        descriptionEn: 'Mughlai heritage mutton curry simmered in a velvety yogurt, cashew, and poppy seed white gravy.',
        image: 'https://images.unsplash.com/photo-1545247181-516773cae7be?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1545247181-516773cae7be?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: false,
        isFeatured: true,
        preparationTimeMinutes: 15,
        dietaryTags: ['Mughlai Classic', 'Nut Gravy', 'Halal'],
        displayOrder: 7,
        rating: 4.8,
        reviewsCount: 65,
        portions: [
          { nameBn: '১ বাটি', nameEn: 'Standard Bowl', price: 320, servingSize: '1-2 Person' },
        ],
        addOns: [
          { nameBn: 'প্লেইন পোলাও', nameEn: 'Plain Polao', price: 150 },
          { nameBn: 'সালাদ', nameEn: 'Salad', price: 30 },
        ],
        nutritionFacts: {
          calories: '380 kcal',
          protein: '20 g',
          carbs: '8 g',
          fat: '22 g',
          fiber: '1 g',
        },
        aboutDishBn: 'মিষ্টি সুবাসিত মোঘলাই স্বাদের রেজালা যা পোলাও বা নান রুটির সাথে অনন্য।',
        aboutDishEn: 'A royal dish with a smooth, subtly aromatic gravy and succulent mutton cuts.',
      },

      // 8. Chicken Roast
      {
        nameBn: 'বিয়ে বাড়ির চিকেন রোস্ট',
        nameEn: 'Chicken Roast',
        slug: 'chicken-roast',
        category: catMap['chicken'],
        price: 280,
        originalPrice: 310,
        descriptionBn: 'ঘিয়ে কড়া ভাজা সোনালী মুরগির মাংস ও বাদাম-পেঁয়াজ বেরেস্তার মিষ্টি-ঝাল ঘন ঝোলের স্পেশাল চিকেন রোস্ট।',
        descriptionEn: 'Classic Bengali wedding-style chicken leg roast slow-cooked in ghee, milk solids, and crispy fried onions.',
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: true,
        isFeatured: false,
        preparationTimeMinutes: 15,
        dietaryTags: ['Wedding Style', 'Ghee Roasted', 'Halal'],
        displayOrder: 8,
        rating: 4.7,
        reviewsCount: 49,
        portions: [
          { nameBn: '১ পিস ফুল লেগ', nameEn: '1 Full Leg Piece', price: 280, servingSize: '1 Person' },
        ],
        addOns: [
          { nameBn: 'প্লেইন পোলাও', nameEn: 'Plain Polao', price: 150 },
          { nameBn: 'বোরহানি', nameEn: 'Borhani', price: 50 },
        ],
        nutritionFacts: {
          calories: '340 kcal',
          protein: '26 g',
          carbs: '6 g',
          fat: '18 g',
          fiber: '1 g',
        },
        aboutDishBn: 'বাঙালি ভোজের অপর নাম বিয়ে বাড়ির স্পেশাল চিকেন রোস্ট।',
        aboutDishEn: 'Tender chicken leg browned in ghee and simmered in a luscious sweet-savory gravy.',
      },

      // 9. Beef Curry
      {
        nameBn: 'ঘরোয়া বিফ কারি / ভুনা',
        nameEn: 'Beef Curry',
        slug: 'beef-curry',
        category: catMap['beef'],
        price: 260,
        originalPrice: 290,
        descriptionBn: 'দেশি পেঁয়াজ, আদা-রসুন ও গুঁড়া মসলায় কষিয়ে রান্না করা গরুর নরম মাংসের ঘন ঝোল।',
        descriptionEn: 'Tender beef chunks slow-simmered in rich homemade onion and tomato gravy with whole aromatic spices.',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 2,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 15,
        dietaryTags: ['Homestyle', 'Rich Gravy', 'Halal'],
        displayOrder: 9,
        rating: 4.6,
        reviewsCount: 42,
        portions: [
          { nameBn: '১ বাটি', nameEn: 'Standard Bowl', price: 260, servingSize: '1-2 Person' },
        ],
        addOns: [
          { nameBn: 'প্লেইন পোলাও', nameEn: 'Plain Polao', price: 150 },
          { nameBn: 'সালাদ', nameEn: 'Salad', price: 30 },
        ],
        nutritionFacts: {
          calories: '360 kcal',
          protein: '25 g',
          carbs: '5 g',
          fat: '20 g',
          fiber: '1 g',
        },
        aboutDishBn: 'প্রতিদিনের খাঁটি ঘরোয়া স্বাদের গরুর মাংসের ঐতিহ্যবাহী ঝোল।',
        aboutDishEn: 'Delicious homestyle spiced beef curry made with care and patience.',
      },

      // 10. Egg Khichuri
      {
        nameBn: 'ডিম ভুনা খিচুড়ি',
        nameEn: 'Egg Khichuri',
        slug: 'egg-khichuri',
        category: catMap['khichuri'],
        price: 180,
        originalPrice: 200,
        descriptionBn: 'সুস্বাদু মুগ ডালের খিচুড়ির সঙ্গে ২টি মসলাদার কড়া ভাজা সিদ্ধ ডিম ও খাঁটি গাওয়া ঘি।',
        descriptionEn: 'Fragrant yellow lentil khichuri served with two spiced hard-boiled fried eggs and pickled green chili.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 10,
        dietaryTags: ['Budget Friendly', 'High Protein', 'Vegetarian Friendly'],
        displayOrder: 10,
        rating: 4.6,
        reviewsCount: 38,
        portions: [
          { nameBn: 'রেগুলার (১ জন)', nameEn: 'Regular (1 Person)', price: 180, servingSize: '1 Person' },
        ],
        addOns: [
          { nameBn: 'অতিরিক্ত ডিম', nameEn: 'Extra Egg', price: 20 },
          { nameBn: 'সালাদ', nameEn: 'Salad', price: 30 },
        ],
        nutritionFacts: {
          calories: '350 kcal',
          protein: '16 g',
          carbs: '45 g',
          fat: '10 g',
          fiber: '3 g',
        },
        aboutDishBn: 'হালকা ও পুষ্টিকর সুস্বাদু নাস্তা বা খাবারের জন্য পারফেক্ট পদ।',
        aboutDishEn: 'Comforting lentil rice served with perfectly spiced pan-fried eggs.',
      },

      // 11. Plain Polao
      {
        nameBn: 'স্পেশাল প্লেইন পোলাও',
        nameEn: 'Plain Polao',
        slug: 'plain-polao',
        category: catMap['rice'],
        price: 150,
        originalPrice: 170,
        descriptionBn: 'ঘিয়ে ভাজা সুগন্ধি চিনিগুঁড়া চাল, এলাচ, দারুচিনি ও পেঁয়াজ বেরেস্তায় সাজানো ঝরঝরে পোলাও।',
        descriptionEn: 'Fragrant Chinigura rice tempered with whole aromatic spices, ghee, and golden crisp shallots.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 0,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 10,
        dietaryTags: ['Aromatic Rice', 'Ghee Flavor', 'Vegetarian'],
        displayOrder: 11,
        rating: 4.5,
        reviewsCount: 29,
        portions: [
          { nameBn: 'রেগুলার প্লেট', nameEn: 'Regular Plate', price: 150, servingSize: '1 Person' },
        ],
        addOns: [
          { nameBn: 'রোস্ট পিস', nameEn: 'Chicken Roast', price: 130 },
          { nameBn: 'ডিম কোরমা', nameEn: 'Egg Korma', price: 30 },
        ],
        nutritionFacts: {
          calories: '310 kcal',
          protein: '6 g',
          carbs: '55 g',
          fat: '7 g',
          fiber: '1 g',
        },
        aboutDishBn: 'ঝরঝরে সুগন্ধি পোলাও যেকোনো রেজালা বা রোস্টের সাথে অনন্য সমন্বয়।',
        aboutDishEn: 'Fluffy ghee-fragrant rice cooked to perfection.',
      },

      // 12. Borhani
      {
        nameBn: 'ঘরোয়া স্পেশাল বোরহানি',
        nameEn: 'Borhani',
        slug: 'borhani',
        category: catMap['drinks'],
        price: 60,
        originalPrice: 70,
        descriptionBn: 'টক দই, পুদিনা পাতা, বিট লবণ ও সিক্রেট ভেষজ মসলায় তৈরি হজমকারক ঐতিহ্যবাহী বোরহানি।',
        descriptionEn: 'Traditional digestive yogurt drink blended with fresh mint, roasted cumin, and black salt.',
        image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 1,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 5,
        dietaryTags: ['Digestive Drink', 'Fresh Mint', 'Probiotic'],
        displayOrder: 12,
        rating: 4.9,
        reviewsCount: 210,
        portions: [
          { nameBn: 'ছোট গ্লাস (২৫০ মি.লি.)', nameEn: 'Glass (250ml)', price: 60, servingSize: '1 Person' },
          { nameBn: 'বোতল (১ লিটার)', nameEn: 'Bottle (1 Liter)', price: 220, servingSize: '4-5 Person' },
        ],
        addOns: [],
        nutritionFacts: {
          calories: '110 kcal',
          protein: '4 g',
          carbs: '10 g',
          fat: '3 g',
          fiber: '0.5 g',
        },
        aboutDishBn: 'ভারী খাবারের পর স্বাস্থ্যসম্মত হজমে সহায়তা করে আমাদের নিজস্ব রেসিপির বোরহানি।',
        aboutDishEn: 'A refreshing and savory yogurt drink made with authentic heritage spices.',
      },

      // 13. Soft Drinks
      {
        nameBn: 'কোল্ড ড্রিংকস ও কোমল পানীয়',
        nameEn: 'Soft Drinks',
        slug: 'soft-drinks',
        category: catMap['drinks'],
        price: 40,
        originalPrice: 40,
        descriptionBn: 'ঠান্ডা কোকাকোলা, স্প্রাইট, ফান্টা বা মাউন্টেন ডিউ (২৫০ মি.লি.)।',
        descriptionEn: 'Chilled bottle / can of Coca-Cola, Sprite, or Fanta.',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 0,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 2,
        dietaryTags: ['Chilled', 'Beverage'],
        displayOrder: 13,
        rating: 4.5,
        reviewsCount: 32,
        portions: [
          { nameBn: '২৫০ মি.লি.', nameEn: '250ml Can', price: 40, servingSize: '1 Person' },
          { nameBn: '৫০০ মি.লি.', nameEn: '500ml Bottle', price: 60, servingSize: '1-2 Person' },
        ],
        addOns: [],
        nutritionFacts: {
          calories: '140 kcal',
          protein: '0 g',
          carbs: '35 g',
          fat: '0 g',
          fiber: '0 g',
        },
        aboutDishBn: 'ঠান্ডা তৃপ্তিদায়ক সফট ড্রিংকস।',
        aboutDishEn: 'Chilled refreshing beverages served cold.',
      },

      // 14. Firni
      {
        nameBn: 'জাফরানি মাটির হাঁড়ি ফিরনি',
        nameEn: 'Firni',
        slug: 'firni',
        category: catMap['desserts'],
        price: 80,
        originalPrice: 90,
        descriptionBn: 'ঘন দুধ, সুগন্ধি চাল ও জাফরান মিশিয়ে মাটির পাত্রে জমানো ঐতিহ্যবাহী ঠান্ডা ফিরনি। পেস্তা-কাজু বাদাম কুচি সাজানো।',
        descriptionEn: 'Traditional slow-cooked saffron rice dessert set in clay pots, topped with crushed pistachios and almonds.',
        image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 0,
        isAvailable: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: 5,
        dietaryTags: ['Clay Pot', 'Saffron Sweet', 'Vegetarian'],
        displayOrder: 14,
        rating: 4.7,
        reviewsCount: 78,
        portions: [
          { nameBn: '১ মাটির পাত্র', nameEn: '1 Clay Bowl', price: 80, servingSize: '1 Person' },
        ],
        addOns: [],
        nutritionFacts: {
          calories: '220 kcal',
          protein: '5 g',
          carbs: '34 g',
          fat: '6 g',
          fiber: '0.5 g',
        },
        aboutDishBn: 'খাবার শেষে মিষ্টি মুখের অতুলনীয় বাঙালি ডেজার্ট।',
        aboutDishEn: 'Rich, creamy and perfectly sweet saffron infused rice pudding.',
      },

      // 15. Jorda
      {
        nameBn: 'শাহী জাফরানি জর্দা',
        nameEn: 'Jorda',
        slug: 'jorda',
        category: catMap['desserts'],
        price: 50,
        originalPrice: 60,
        descriptionBn: 'ছোট মিষ্টি, মোরব্বা, মাওয়া ও ড্রাই ফ্রুটস সহযোগে তৈরি ঐতিহ্যবাহী বিয়ে বাড়ির শাহী মিষ্টি জর্দা।',
        descriptionEn: 'Traditional royal sweet saffron rice dressed with mini gulab jamuns, candied fruits, mawa, and nuts.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
        galleryImages: [
          'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
        ],
        spiceLevel: 0,
        isAvailable: true,
        isBestseller: false,
        isFeatured: false,
        preparationTimeMinutes: 5,
        dietaryTags: ['Royal Dessert', 'Dry Fruits', 'Vegetarian'],
        displayOrder: 15,
        rating: 4.6,
        reviewsCount: 35,
        portions: [
          { nameBn: '১ কাপ', nameEn: '1 Cup', price: 50, servingSize: '1 Person' },
        ],
        addOns: [],
        nutritionFacts: {
          calories: '240 kcal',
          protein: '3 g',
          carbs: '42 g',
          fat: '5 g',
          fiber: '0.5 g',
        },
        aboutDishBn: 'উৎসব ও উদযাপনের খাঁটি বাঙালি মিষ্টি পদ।',
        aboutDishEn: 'Celebratory festive sweet rice loaded with mawa and candied fruits.',
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
        code: 'KHICHURI50',
        titleBn: 'খাসির খিচুড়ি স্পেশাল ৫০ টাকা ছাড়',
        titleEn: 'Mutton Khichuri Special ৳50 OFF',
        descriptionBn: '৫০০ টাকার অর্ডারে সরাসরি ৫০ টাকা ছাড়',
        descriptionEn: 'Flat ৳50 off on orders above ৳500',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 500,
        expiryDate: nextYear,
        isActive: true,
      },
    ]);

    // 5. Seed Restaurant Settings with CMS
    console.log('[Seed] Seeding Restaurant Settings with CMS...');
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
      // Hero CMS
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
      // About CMS
      aboutTitleBn: 'আমাদের গল্প',
      aboutTitleEn: 'Our Story',
      aboutDescBn: '১৯৭২ সালে মতিঝিলের প্রাণকেন্দ্রে শুরু হয় ঘরোয়ার যাত্রা। বিগত ৫ দশকেরও বেশি সময় ধরে আমরা ধরে রেখেছি খাঁটি ঢাকাইয়া রান্নার অতুলনীয় ঐতিহ্য ও স্বাদ।',
      aboutDescEn: 'Khichuri House started with a simple goal — to serve authentic Bengali flavors with the best quality and love. Our Mutton Khichuri is our signature dish loved by thousands.',
      aboutImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop',
      aboutStats: [
        { labelBn: 'বছরের অভিজ্ঞতা', labelEn: 'Years Experience', value: '10+' },
        { labelBn: 'সন্তুষ্ট গ্রাহক', labelEn: 'Happy Customers', value: '50K+' },
        { labelBn: 'তাজা উপাদান', labelEn: 'Fresh Ingredients', value: '100%' },
        { labelBn: 'গ্রাহক রেটিং', labelEn: 'Customer Rating', value: '4.9 ★' },
      ],
      // Chef CMS
      chefName: 'Chef Rahman',
      chefDesignation: 'Executive Master Chef',
      chefBioBn: '২৫ বছরেরও বেশি রন্ধন অভিজ্ঞতায় ঐতিহ্যবাহী মশলা ও খাঁটি ঘরোয়া স্বাদের বিশ্বস্ত রূপকার।',
      chefBioEn: 'Over 25 years of mastery in authentic slow-cooked traditional Bangladeshi heritage cuisine.',
      chefExperience: '25+ Years Experience',
      chefSpecialty: 'Dum Pukht & Heritage Khichuri',
      chefImageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop',
      // Owner CMS
      ownerName: 'Alhaj Md. Sirajuddin',
      ownerDesignation: 'Founder & Visionary',
      ownerStoryBn: '১৯৭২ সালে মতিঝিলে ছোট্ট পরিসরে শুরু করা ঘরোয়া আজ ঢাকার ঐতিহ্যের অংশ। আমাদের অঙ্গীকার কেবল মান ও খাঁটি স্বাদ।',
      ownerStoryEn: 'Founded with the philosophy that great food brings families and hearts together with honesty and passion.',
      ownerQuoteBn: 'স্বাদ যেখানে স্মৃতি, তৃপ্তি যেখানে প্রতিশ্রুতি।',
      ownerQuoteEn: 'Where culinary tradition meets timeless hospitality.',
      ownerImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
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
  }
};

if (require.main === module) {
  seedDatabase();
}
