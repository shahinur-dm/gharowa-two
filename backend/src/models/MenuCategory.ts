import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuCategory extends Document {
  nameBn: string;
  nameEn: string;
  slug: string;
  displayOrder: number;
  icon?: string;
  isActive: boolean;
}

const MenuCategorySchema = new Schema<IMenuCategory>(
  {
    nameBn: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayOrder: { type: Number, default: 0 },
    icon: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuCategory = mongoose.model<IMenuCategory>('MenuCategory', MenuCategorySchema);
