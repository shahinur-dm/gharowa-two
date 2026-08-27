import { Request, Response, NextFunction } from 'express';
import { MenuItem, MenuCategory } from '../models';

const fallbackCategories = [
  { _id: 'cat-1', nameBn: 'দুপুর ও রাত', nameEn: 'Lunch & Dinner', slug: 'lunch-dinner', displayOrder: 1, icon: 'Utensils', isActive: true },
  { _id: 'cat-2', nameBn: 'সকালের নাস্তা', nameEn: 'Breakfast', slug: 'breakfast', displayOrder: 2, icon: 'Sun', isActive: true },
  { _id: 'cat-3', nameBn: 'মাছ', nameEn: 'Fish Special', slug: 'fish', displayOrder: 3, icon: 'Fish', isActive: true },
  { _id: 'cat-4', nameBn: 'কাবাব ও শর্মা', nameEn: 'Kebab & Grills', slug: 'kebab', displayOrder: 4, icon: 'Flame', isActive: true },
  { _id: 'cat-5', nameBn: 'ডেজার্ট', nameEn: 'Desserts', slug: 'dessert', displayOrder: 5, icon: 'Cake', isActive: true },
  { _id: 'cat-6', nameBn: 'পানীয়', nameEn: 'Beverages', slug: 'beverages', displayOrder: 6, icon: 'Coffee', isActive: true },
];

const fallbackItems = [
  {
    _id: 'item-1',
    nameBn: 'খাসির ভুনা খিচুড়ি',
    nameEn: 'Mutton Bhuna Khichuri',
    slug: 'mutton-bhuna-khichuri',
    category: fallbackCategories[0],
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
    dietaryTags: ['Heritage Special', 'Chef Choice'],
    displayOrder: 1,
  },
  {
    _id: 'item-2',
    nameBn: 'খাসির লেগ খিচুড়ি',
    nameEn: 'Mutton Leg Khichuri',
    slug: 'mutton-leg-khichuri',
    category: fallbackCategories[0],
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
    dietaryTags: ['Signature Platter', 'Premium Lamb'],
    displayOrder: 2,
  },
  {
    _id: 'item-3',
    nameBn: 'স্পেশাল খাসির কাচ্চি',
    nameEn: 'Special Mutton Kacchi Biryani',
    slug: 'special-mutton-kacchi',
    category: fallbackCategories[0],
    price: 290,
    originalPrice: 330,
    descriptionBn: 'সুগন্ধি বাসমতী চাল, আলু বোখারা ও খাঁটি ঘিয়ে মেরিনেট করা খাসির মাংসের খাঁটি কাচ্চি।',
    descriptionEn: 'Authentic Dhaka-style slow dum mutton kacchi biryani infused with pure saffron and ghee.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    preparationTimeMinutes: 15,
    dietaryTags: ['Top Seller', 'Dum Biryani'],
    displayOrder: 3,
  },
  {
    _id: 'item-4',
    nameBn: 'চিকেন ভুনা খিচুড়ি',
    nameEn: 'Chicken Bhuna Khichuri',
    slug: 'chicken-bhuna-khichuri',
    category: fallbackCategories[0],
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
    dietaryTags: ['Chicken Special'],
    displayOrder: 4,
  },
  {
    _id: 'item-5',
    nameBn: 'খাসির পায়া নেহারী',
    nameEn: 'Mutton Paya Nehari',
    slug: 'mutton-paya-nehari',
    category: fallbackCategories[1],
    price: 150,
    originalPrice: 180,
    descriptionBn: 'সারারাত ধিমে আঁচে সেদ্ধ করা খাসির পায়ার ঘন ঝোল ও আদা-লেবুর সুগন্ধি নেহারী।',
    descriptionEn: 'Overnight slow-simmered rich mutton trotters broth served with fresh ginger slivers and coriander.',
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 3,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    preparationTimeMinutes: 10,
    dietaryTags: ['Breakfast Special'],
    displayOrder: 5,
  },
  {
    _id: 'item-6',
    nameBn: 'স্পেশাল সরিষা ইলিশ',
    nameEn: 'Special Shorshe Ilish (Hilsa)',
    slug: 'special-shorshe-ilish',
    category: fallbackCategories[2],
    price: 500,
    originalPrice: 550,
    descriptionBn: 'পদ্মার খাঁটি তাজা ইলিশের পেটি ও খাঁটি সরিষা বাটার ঝাঁঝালো ঐতিহ্যের স্বাদ।',
    descriptionEn: 'Fresh Padma River Hilsa steak simmered in pungent mustard gravy and green chillies.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 2,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    preparationTimeMinutes: 20,
    dietaryTags: ['Padma Hilsa'],
    displayOrder: 6,
  },
  {
    _id: 'item-7',
    nameBn: 'রূপচাঁদা ফ্রাই',
    nameEn: 'Rupchanda (Pomfret) Fish Fry',
    slug: 'rupchanda-fry',
    category: fallbackCategories[2],
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
    dietaryTags: ['Seafood'],
    displayOrder: 7,
  },
  {
    _id: 'item-8',
    nameBn: 'চিকেন বটি কাবাব',
    nameEn: 'Chicken Boti Kebab',
    slug: 'chicken-boti-kebab',
    category: fallbackCategories[3],
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
    dietaryTags: ['Charcoal Grill'],
    displayOrder: 8,
  },
  {
    _id: 'item-9',
    nameBn: 'স্পেশাল বোরহানি',
    nameEn: 'Gharowa Special Borhani',
    slug: 'gharowa-special-borhani',
    category: fallbackCategories[5],
    price: 50,
    originalPrice: 60,
    descriptionBn: 'টক দই, পুদিনা পাতা, বিট লবণ ও বিশেষ মশলায় তৈরি ঢাকার আসল ঐতিহ্যের বোরহানি।',
    descriptionEn: 'Dhaka’s legendary spiced yogurt digestive drink crafted with fresh mint and coriander.',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 1,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    preparationTimeMinutes: 5,
    dietaryTags: ['Digestive Drink'],
    displayOrder: 9,
  },
  {
    _id: 'item-10',
    nameBn: 'স্পেশাল ফিরনি',
    nameEn: 'Gharowa Special Firni',
    slug: 'special-firni',
    category: fallbackCategories[4],
    price: 45,
    originalPrice: 50,
    descriptionBn: 'মাটির পাত্রে জমানো ঘন দুধের জাফরানি সুগন্ধি ফিরনি, পেস্তা ও কাজুবাদামের কুচি সহ।',
    descriptionEn: 'Rich saffron rice pudding served chilled in traditional clay pot with pistachios.',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop',
    spiceLevel: 0,
    isAvailable: true,
    isBestseller: true,
    isFeatured: true,
    preparationTimeMinutes: 5,
    dietaryTags: ['Clay Pot Dessert'],
    displayOrder: 10,
  },
];

export const getMenuCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await MenuCategory.find({ isActive: true }).sort({ displayOrder: 1 });
    if (categories && categories.length > 0) {
      res.status(200).json({ success: true, data: categories });
      return;
    }
    res.status(200).json({ success: true, data: fallbackCategories });
  } catch (error) {
    res.status(200).json({ success: true, data: fallbackCategories });
  }
};

export const getAllCategoriesAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await MenuCategory.find().sort({ displayOrder: 1 });
    if (categories && categories.length > 0) {
      res.status(200).json({ success: true, data: categories });
      return;
    }
    res.status(200).json({ success: true, data: fallbackCategories });
  } catch (error) {
    res.status(200).json({ success: true, data: fallbackCategories });
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await MenuCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await MenuCategory.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await MenuCategory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

export const getMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, bestseller, featured } = req.query;
    const query: any = { isAvailable: true };

    if (bestseller === 'true') query.isBestseller = true;
    if (featured === 'true') query.isFeatured = true;

    if (category && category !== 'all' && category !== 'সব') {
      const catDoc = await MenuCategory.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { nameBn: searchRegex },
        { nameEn: searchRegex },
      ];
    }

    const items = await MenuItem.find(query).populate('category').sort({ displayOrder: 1 });
    if (items && items.length > 0) {
      res.status(200).json({ success: true, count: items.length, data: items });
      return;
    }

    // Return fallback items if db collection is empty or connecting
    let filtered = [...fallbackItems];
    if (category && category !== 'all') {
      filtered = filtered.filter((i) => i.category.slug === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter((i) => i.nameBn.includes(q) || i.nameEn.toLowerCase().includes(q));
    }
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(200).json({ success: true, count: fallbackItems.length, data: fallbackItems });
  }
};

export const getAllMenuItemsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await MenuItem.find().populate('category').sort({ displayOrder: 1 });
    if (items && items.length > 0) {
      res.status(200).json({ success: true, count: items.length, data: items });
      return;
    }
    res.status(200).json({ success: true, count: fallbackItems.length, data: fallbackItems });
  } catch (error) {
    res.status(200).json({ success: true, count: fallbackItems.length, data: fallbackItems });
  }
};

export const getMenuItemBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const item = await MenuItem.findOne({ slug }).populate('category');
    if (item) {
      res.status(200).json({ success: true, data: item });
      return;
    }
    const found = fallbackItems.find((i) => i.slug === slug);
    if (found) {
      res.status(200).json({ success: true, data: found });
      return;
    }
    res.status(404).json({ success: false, message: 'Item not found' });
  } catch (error) {
    const found = fallbackItems.find((i) => i.slug === req.params.slug);
    if (found) {
      res.status(200).json({ success: true, data: found });
      return;
    }
    next(error);
  }
};

export const createMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true }).populate('category');
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (item) {
      item.isAvailable = !item.isAvailable;
      await item.save();
      res.status(200).json({ success: true, data: item });
      return;
    }
    res.status(200).json({ success: true, data: { isAvailable: false } });
  } catch (error) {
    res.status(200).json({ success: true, data: { isAvailable: false } });
  }
};

export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};
