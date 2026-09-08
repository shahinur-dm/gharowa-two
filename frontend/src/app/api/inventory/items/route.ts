import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface InventoryItemData {
  _id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPerUnit: number;
  lastRestocked: string;
}

let globalInventory: InventoryItemData[] = [
  {
    _id: 'inv-1',
    nameBn: 'খাসির মাংস (Mutton)',
    nameEn: 'Fresh Mutton Shank & Shoulder',
    category: 'Meat',
    currentStock: 45,
    minThreshold: 20,
    unit: 'কেজি (kg)',
    costPerUnit: 1100,
    lastRestocked: '2026-09-07',
  },
  {
    _id: 'inv-2',
    nameBn: 'বাসমতী চাল (Basmati Rice)',
    nameEn: 'Premium Kalijeera / Basmati Rice',
    category: 'Grains',
    currentStock: 120,
    minThreshold: 50,
    unit: 'কেজি (kg)',
    costPerUnit: 140,
    lastRestocked: '2026-09-05',
  },
  {
    _id: 'inv-3',
    nameBn: 'খাঁটি সরিষার তেল ও ঘি',
    nameEn: 'Pure Mustard Oil & Ghee',
    category: 'Oils',
    currentStock: 15,
    minThreshold: 10,
    unit: 'লিটার (L)',
    costPerUnit: 280,
    lastRestocked: '2026-09-06',
  },
  {
    _id: 'inv-4',
    nameBn: 'স্পেশাল কাচ্চি ও খিচুড়ি মসলা',
    nameEn: 'Gharowa Secret Spice Blend',
    category: 'Spices',
    currentStock: 8,
    minThreshold: 10,
    unit: 'কেজি (kg)',
    costPerUnit: 950,
    lastRestocked: '2026-09-04',
  },
];

export async function GET() {
  const lowStockCount = globalInventory.filter(
    (i) => i.currentStock <= i.minThreshold
  ).length;

  return NextResponse.json(
    {
      success: true,
      count: globalInventory.length,
      lowStockCount,
      data: globalInventory,
    },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}
