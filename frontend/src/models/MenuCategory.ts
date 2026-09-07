import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuCategory extends Document {
  nameBn: string;
  nameEn: string;
  slug: string;
  descriptionBn?: string;
  descriptionEn?: string;
  image?: string;
  icon?: string;
  status?: string;
  displayOrder: number;
  isActive: boolean;
}

const MenuCategorySchema = new Schema<IMenuCategory>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    descriptionBn: { type: String, default: '' },
    descriptionEn: { type: String, default: '' },
    image: { type: String, default: '' },
    icon: { type: String, default: 'Utensils' },
    status: { type: String, default: 'active' },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuCategory: Model<IMenuCategory> =
  mongoose.models.MenuCategory || mongoose.model<IMenuCategory>('MenuCategory', MenuCategorySchema);
