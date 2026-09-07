import mongoose, { Schema, Document, Model } from 'mongoose';

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
  image: string;
  galleryImages: string[];
  spiceLevel: number;
  isAvailable: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  preparationTimeMinutes: number;
  servingSize?: string;
  ingredients?: string[];
  dietaryTags: string[];
  displayOrder: number;
  rating: number;
  reviewsCount: number;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    descriptionBn: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    image: { type: String, required: true },
    galleryImages: [{ type: String }],
    spiceLevel: { type: Number, default: 0, min: 0, max: 3 },
    isAvailable: { type: Boolean, default: true },
    isBestseller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    preparationTimeMinutes: { type: Number, default: 15 },
    servingSize: { type: String, default: '১ জন (1 Person)' },
    ingredients: [{ type: String }],
    dietaryTags: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 25 },
  },
  { timestamps: true }
);

export const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
