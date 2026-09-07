import mongoose, { Document, Schema } from 'mongoose';

export interface IPortionOption {
  nameBn: string;
  nameEn: string;
  price: number;
  servingSize: string;
}

export interface IAddOnOption {
  nameBn: string;
  nameEn: string;
  price: number;
}

export interface INutritionFacts {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
}

export interface IMenuItem extends Document {
  nameBn: string;
  nameEn: string;
  slug: string;
  sku?: string;
  category: mongoose.Types.ObjectId;
  price: number;
  originalPrice?: number;
  descriptionBn: string;
  descriptionEn: string;
  shortDescriptionBn?: string;
  shortDescriptionEn?: string;
  image: string;
  galleryImages: string[];
  spiceLevel: number; // 0: None, 1: Mild, 2: Medium, 3: Hot
  isAvailable: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isPopular?: boolean;
  preparationTimeMinutes?: number;
  servingSize?: string;
  ingredients?: string;
  dietaryTags: string[];
  displayOrder: number;
  rating: number;
  reviewsCount: number;
  portions: IPortionOption[];
  addOns: IAddOnOption[];
  nutritionFacts?: INutritionFacts;
  aboutDishBn?: string;
  aboutDishEn?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const PortionOptionSchema = new Schema<IPortionOption>(
  {
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    servingSize: { type: String, default: '1 Person' },
  },
  { _id: false }
);

const AddOnOptionSchema = new Schema<IAddOnOption>(
  {
    nameBn: { type: String, required: true },
    nameEn: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const NutritionFactsSchema = new Schema<INutritionFacts>(
  {
    calories: { type: String, default: '450 kcal' },
    protein: { type: String, default: '18 g' },
    carbs: { type: String, default: '52 g' },
    fat: { type: String, default: '15 g' },
    fiber: { type: String, default: '2 g' },
  },
  { _id: false }
);

const MenuItemSchema = new Schema<IMenuItem>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, default: '' },
    category: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    descriptionBn: { type: String, default: '', trim: true },
    descriptionEn: { type: String, default: '', trim: true },
    shortDescriptionBn: { type: String, default: '', trim: true },
    shortDescriptionEn: { type: String, default: '', trim: true },
    image: { type: String, required: true },
    galleryImages: [{ type: String }],
    spiceLevel: { type: Number, default: 1, min: 0, max: 3 },
    isAvailable: { type: Boolean, default: true, index: true },
    isBestseller: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },
    preparationTimeMinutes: { type: Number, default: 15 },
    servingSize: { type: String, default: '1 Person' },
    ingredients: { type: String, default: '' },
    dietaryTags: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
    rating: { type: Number, default: 4.9, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 124 },
    portions: [PortionOptionSchema],
    addOns: [AddOnOptionSchema],
    nutritionFacts: NutritionFactsSchema,
    aboutDishBn: { type: String, default: '' },
    aboutDishEn: { type: String, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
