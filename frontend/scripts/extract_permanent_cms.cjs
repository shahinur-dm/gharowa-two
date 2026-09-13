const fs = require('fs');
const path = require('path');

const backupPath = path.resolve(__dirname, '../../database_backups/latest_backup.json');
const publicDir = path.resolve(__dirname, '../public/cms');
const outJson = path.resolve(__dirname, '../src/data/permanentCms.json');

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(path.dirname(outJson), { recursive: true });

const db = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

function saveDataUrl(dataUrl, fileBase) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return dataUrl || '';
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) return dataUrl;
  const ext = match[1].includes('png') ? 'png' : match[1].includes('webp') ? 'webp' : 'jpg';
  const fileName = `${fileBase}.${ext}`;
  fs.writeFileSync(path.join(publicDir, fileName), Buffer.from(match[2], 'base64'));
  return `/cms/${fileName}`;
}

const cats = (db.menucategories || []).map((c) => ({
  _id: String(c._id),
  nameBn: c.nameBn,
  nameEn: c.nameEn,
  slug: c.slug,
  descriptionBn: c.descriptionBn || '',
  descriptionEn: c.descriptionEn || '',
  image: saveDataUrl(c.image, `cat-${c.slug || c._id}`),
  icon: c.icon || '',
  displayOrder: c.displayOrder ?? 0,
  isActive: c.isActive !== false,
}));

const catById = Object.fromEntries(cats.map((c) => [c._id, c]));

const menuItems = (db.menuitems || []).map((i, idx) => {
  const catId = String(i.category);
  return {
    _id: String(i._id),
    nameBn: i.nameBn,
    nameEn: i.nameEn,
    slug: i.slug || `item-${idx}`,
    sku: i.sku || '',
    category: catById[catId] || catId,
    price: i.price,
    originalPrice: i.originalPrice,
    descriptionBn: i.descriptionBn || '',
    descriptionEn: i.descriptionEn || '',
    image: saveDataUrl(i.image, `menu-${i.slug || i._id}`),
    galleryImages: (i.galleryImages || [])
      .map((g, gi) => saveDataUrl(g, `menu-${i.slug || i._id}-g${gi}`))
      .filter(Boolean),
    spiceLevel: i.spiceLevel ?? 1,
    isAvailable: i.isAvailable !== false,
    isBestseller: !!i.isBestseller,
    isFeatured: !!i.isFeatured,
    isPopular: !!i.isPopular,
    preparationTimeMinutes: i.preparationTimeMinutes ?? 15,
    servingSize: i.servingSize || '১ জন',
    ingredients: i.ingredients || [],
    dietaryTags: i.dietaryTags || [],
    displayOrder: i.displayOrder ?? idx + 1,
    rating: i.rating ?? 4.9,
    reviewsCount: i.reviewsCount ?? 0,
  };
});

const s = db.restaurantsettings[0] || {};
const settings = { ...s };
delete settings.__v;
const imageKeys = [
  'heroImageUrl',
  'heroPouringImageUrl',
  'aboutImageUrl',
  'chefImageUrl',
  'ownerImageUrl',
  'faviconUrl',
  'logoUrl',
  'menuBoardImageUrl',
  'ogImageUrl',
];
for (const key of imageKeys) {
  if (settings[key]) settings[key] = saveDataUrl(settings[key], key.replace(/Url$/, '').toLowerCase());
}
settings._id = String(settings._id || 'permanent-settings');

const brands = (db.brandpartners || []).map((b, i) => ({
  _id: String(b._id),
  name: b.name,
  logoUrl: saveDataUrl(b.logoUrl, `brand-${i + 1}`),
  websiteUrl: b.websiteUrl || '',
  displayOrder: b.displayOrder ?? i + 1,
  isActive: b.isActive !== false,
}));

const screenshotBanks = [
  { _id: 'brand-ific', name: 'IFIC Bank', logoUrl: '/cms/banks/ific.svg' },
  { _id: 'brand-janata', name: 'Janata Bank Limited', logoUrl: '/cms/banks/janata.svg' },
  { _id: 'brand-krishi', name: 'Bangladesh Krishi Bank', logoUrl: '/cms/banks/krishi.svg' },
  { _id: 'brand-agrani', name: 'Agrani Bank Limited', logoUrl: '/cms/banks/agrani.svg' },
  { _id: 'brand-dbbl', name: 'Dutch-Bangla Bank', logoUrl: '/cms/banks/dbbl.svg' },
].map((b, i) => ({ ...b, websiteUrl: '', displayOrder: 100 + i, isActive: true }));

const heroSlides = (db.heroslides || []).map((h, i) => ({
  _id: String(h._id),
  title: h.title,
  titleBn: h.titleBn,
  subtitleEn: h.subtitleEn,
  subtitleBn: h.subtitleBn,
  badgeText: h.badgeText,
  badgeBn: h.badgeBn,
  mediaType: h.mediaType || 'image',
  mainImageUrl: saveDataUrl(h.mainImageUrl, `hero-${i + 1}`),
  videoUrl: h.videoUrl || '',
  supportingImageUrl: saveDataUrl(h.supportingImageUrl, `hero-${i + 1}-sup`) || '',
  displayOrder: h.displayOrder ?? i + 1,
  slideDurationSeconds: h.slideDurationSeconds ?? 4,
  isActive: h.isActive !== false,
}));

const reviews = (db.customerreviews || []).map((r, i) => ({
  _id: String(r._id),
  customerName: r.customerName,
  avatarUrl: saveDataUrl(r.avatarUrl, `review-${i + 1}`) || '',
  rating: r.rating ?? 5,
  reviewText: r.reviewText,
  reviewDateText: r.reviewDateText || '',
  platform: r.platform || 'google',
  isVerified: r.isVerified !== false,
  displayOrder: r.displayOrder ?? i + 1,
  isActive: r.isActive !== false,
}));

const blogs = (db.blogvideos || []).map((v, i) => ({
  _id: String(v._id),
  title: v.title,
  titleBn: v.titleBn,
  videoUrl: v.videoUrl,
  thumbnailUrl: saveDataUrl(v.thumbnailUrl, `blog-${i + 1}`) || v.thumbnailUrl,
  duration: v.duration || '',
  authorName: v.authorName || '',
  displayOrder: v.displayOrder ?? i + 1,
  isActive: v.isActive !== false,
}));

const payload = {
  settings,
  categories: cats,
  menuItems,
  brandPartners: [...brands, ...screenshotBanks],
  heroSlides,
  reviews,
  blogs,
};

fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), 'utf8');
console.log('Wrote', outJson);
console.log('Images in', publicDir, fs.readdirSync(publicDir).length, 'files');
console.log('Menu items', menuItems.length, 'brands', payload.brandPartners.length);
