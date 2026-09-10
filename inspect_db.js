const mongoose = require('./frontend/node_modules/mongoose');
const uri = 'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/Gharowa?appName=dawatit';

async function inspect() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('=== DATABASE INSPECTION ===');
  console.log('Database Name:', mongoose.connection.db.databaseName);

  const items = await mongoose.connection.db.collection('menuitems').find({}).toArray();
  console.log('\n--- ALL MENU ITEMS IN MONGODB (' + items.length + ') ---');
  items.forEach((item, idx) => {
    console.log(`\nItem #${idx + 1}:`);
    console.log(JSON.stringify({
      _id: item._id?.toString(),
      nameEn: item.nameEn,
      nameBn: item.nameBn,
      slug: item.slug,
      category: item.category,
      categoryType: typeof item.category,
      price: item.price,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      isPopular: item.isPopular,
      isBestseller: item.isBestseller,
      displayOrder: item.displayOrder,
      image: item.image?.slice(0, 40) + '...',
      createdAt: item.createdAt,
    }, null, 2));
  });

  const categories = await mongoose.connection.db.collection('menucategories').find({}).toArray();
  console.log('\n--- ALL CATEGORIES IN MONGODB (' + categories.length + ') ---');
  categories.forEach(c => {
    console.log(JSON.stringify({
      _id: c._id?.toString(),
      nameEn: c.nameEn,
      nameBn: c.nameBn,
      slug: c.slug,
      isActive: c.isActive,
      displayOrder: c.displayOrder,
    }, null, 2));
  });

  const settings = await mongoose.connection.db.collection('restaurantsettings').findOne({});
  console.log('\n--- RESTAURANT SETTINGS IN MONGODB ---');
  console.log(JSON.stringify({
    _id: settings?._id?.toString(),
    chefName: settings?.chefName,
    chefNameBn: settings?.chefNameBn,
    chefNameEn: settings?.chefNameEn,
    chefDesignation: settings?.chefDesignation,
    chefTitleBn: settings?.chefTitleBn,
    chefTitleEn: settings?.chefTitleEn,
    chefBio: settings?.chefBio,
    chefBioBn: settings?.chefBioBn,
    chefBioEn: settings?.chefBioEn,
    chefExperience: settings?.chefExperience,
    chefSpecialty: settings?.chefSpecialty,
    chefImageUrl: settings?.chefImageUrl?.slice(0, 40),
    ownerName: settings?.ownerName,
    ownerNameBn: settings?.ownerNameBn,
    ownerNameEn: settings?.ownerNameEn,
    ownerDesignation: settings?.ownerDesignation,
    ownerTitleBn: settings?.ownerTitleBn,
    ownerTitleEn: settings?.ownerTitleEn,
    ownerQuote: settings?.ownerQuote,
    ownerQuoteBn: settings?.ownerQuoteBn,
    ownerQuoteEn: settings?.ownerQuoteEn,
    ownerStoryBn: settings?.ownerStoryBn?.slice(0, 40),
    ownerStoryEn: settings?.ownerStoryEn?.slice(0, 40),
    ownerImageUrl: settings?.ownerImageUrl?.slice(0, 40),
  }, null, 2));

  await mongoose.disconnect();
  process.exit(0);
}

inspect().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
