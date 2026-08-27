import { Request, Response, NextFunction } from 'express';
import { MenuItem, MenuCategory } from '../models';

export const getMenuCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await MenuCategory.find({ isActive: true }).sort({ displayOrder: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await MenuCategory.find().sort({ displayOrder: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nameBn, nameEn, slug, displayOrder, icon, isActive } = req.body;
    const category = await MenuCategory.create({
      nameBn,
      nameEn,
      slug: slug || nameEn.toLowerCase().replace(/\s+/g, '-'),
      displayOrder: displayOrder || 0,
      icon,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({ success: true, data: category, message: 'ক্যাটাগরি তৈরি হয়েছে / Category created' });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await MenuCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      res.status(404).json({ success: false, message: 'Category not found' });
      return;
    }
    res.status(200).json({ success: true, data: category, message: 'ক্যাটাগরি আপডেট হয়েছে / Category updated' });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await MenuCategory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'ক্যাটাগরি মুছে ফেলা হয়েছে / Category deleted' });
  } catch (error) {
    next(error);
  }
};

export const getMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, bestseller, featured, availableOnly } = req.query;

    const query: any = {};
    if (availableOnly === 'true' || availableOnly === undefined) {
      query.isAvailable = true;
    }
    if (bestseller === 'true') {
      query.isBestseller = true;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }
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
        { descriptionBn: searchRegex },
        { descriptionEn: searchRegex },
      ];
    }

    const items = await MenuItem.find(query).populate('category').sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

export const getAllMenuItemsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const items = await MenuItem.find().populate('category').sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const item = await MenuItem.findOne({ slug }).populate('category');
    if (!item) {
      res.status(404).json({ success: false, message: 'খাবারের আইটেম পাওয়া যায়নি / Menu item not found' });
      return;
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item, message: 'মেনু আইটেম তৈরি হয়েছে / Menu item created' });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true }).populate('category');
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }
    res.status(200).json({ success: true, data: item, message: 'মেনু আইটেম আপডেট হয়েছে / Menu item updated' });
  } catch (error) {
    next(error);
  }
};

export const toggleAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Menu item not found' });
      return;
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.status(200).json({
      success: true,
      data: item,
      message: `আইটেমটি এখন ${item.isAvailable ? 'উপলব্ধ (Available)' : 'অনুপলব্ধ (Unavailable)'}`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'মেনু আইটেম মুছে ফেলা হয়েছে / Menu item deleted' });
  } catch (error) {
    next(error);
  }
};
