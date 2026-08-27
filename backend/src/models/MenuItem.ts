import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem extends Document {
  nameBn: string;
  nameEn: string;
  slug: string;
  category: mongoose.Types.ObjectId;
  price: number;
  originalPrice?: number;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  spiceLevel: number; // 0: None, 1: Mild, 2: Medium, 3: Hot
  isAvailable: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  preparationTimeMinutes?: number;
  dietaryTags: string[];
  displayOrder: number;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    descriptionBn: { type: String, default: '', trim: true },
    descriptionEn: { type: String, default: '', trim: true },
    image: { type: String, required: true },
    spiceLevel: { type: Number, default: 1, min: 0, max: 3 },
    isAvailable: { type: Boolean, default: true, index: true },
    isBestseller: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    preparationTimeMinutes: { type: Number, default: 15 },
    dietaryTags: [{ type: String }],
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
