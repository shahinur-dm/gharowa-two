const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/Gharowa?appName=dawatit';

async function checkDocSizes() {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000, family: 4 });
  const db = mongoose.connection.db;

  const settings = await db.collection('restaurantsettings').findOne({});
  console.log('=== SETTINGS FIELD SIZES ===');
  for (const [key, val] of Object.entries(settings || {})) {
    const size = Buffer.byteLength(JSON.stringify(val) || '');
    if (size > 1000) {
      console.log(`Field ${key}: ${size} bytes (${Math.round(size/1024)} KB)`);
    }
  }

  const items = await db.collection('menuitems').find({}).toArray();
  console.log('\n=== MENU ITEMS FIELD SIZES (Count: ' + items.length + ') ===');
  for (const item of items) {
    const totalSize = Buffer.byteLength(JSON.stringify(item));
    console.log(`Item "${item.nameBn}" (${item.slug}): Total size ${Math.round(totalSize/1024)} KB`);
    for (const [k, v] of Object.entries(item)) {
      const s = Buffer.byteLength(JSON.stringify(v) || '');
      if (s > 5000) {
        console.log(`  - Field ${k}: ${Math.round(s/1024)} KB`);
      }
    }
  }

  process.exit(0);
}

checkDocSizes().catch(e => { console.error(e); process.exit(1); });
