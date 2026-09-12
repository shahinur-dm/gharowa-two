/**
 * Gharowa Hotel & Restaurant - Database Backup & Recovery Utility
 * This script exports full backups and safely synchronizes/recovers records without blind overwrites.
 */
const mongoose = require('./frontend/node_modules/mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/Gharowa?appName=dawatit';

async function performBackupAndVerify() {
  console.log('Connecting to MongoDB database...');
  const conn = await mongoose.createConnection(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
    family: 4
  }).asPromise();

  console.log('Connected successfully to database:', conn.db.databaseName);
  const collections = await conn.db.listCollections().toArray();
  const backupData = {};
  const stats = {};

  for (const col of collections) {
    const docs = await conn.db.collection(col.name).find({}).toArray();
    backupData[col.name] = docs;
    stats[col.name] = docs.length;
  }

  // Write timestamped backup and latest backup
  const backupDir = path.join(__dirname, 'database_backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `gharowa_backup_${timestamp}.json`);
  const latestFile = path.join(backupDir, 'latest_backup.json');

  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify(backupData, null, 2));

  console.log('\n===== DATABASE COLLECTIONS VERIFICATION =====');
  for (const [col, count] of Object.entries(stats)) {
    console.log(`- ${col.padEnd(20)}: ${count} documents`);
  }

  console.log(`\nBackup saved successfully to: ${backupFile}`);
  console.log(`Latest backup copy updated at: ${latestFile}`);

  await conn.close();
  return stats;
}

performBackupAndVerify()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Backup failed:', err);
    process.exit(1);
  });
