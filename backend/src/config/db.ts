import mongoose from 'mongoose';
import dns from 'dns';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './index';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // ignore
}

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    console.log(`[MongoDB] Connecting to primary URI: ${config.mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Primary connection established: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB] Primary connection failed (${error?.message || error}). Initializing local fallback database...`);
    try {
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'gharowa_db',
        },
      });
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Fallback database connected successfully: ${uri}`);
      return conn;
    } catch (fallbackError) {
      console.error('[MongoDB] Critical database failure:', fallbackError);
      process.exit(1);
    }
  }
};
