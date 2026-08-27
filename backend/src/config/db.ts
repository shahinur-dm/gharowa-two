import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './index';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

let isConnected = false;

export const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    console.log(`[MongoDB] Attempting connection to: ${config.mongoUri.replace(/:([^@]+)@/, ':****@')}`);
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`[MongoDB] Primary connection established: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB] Cloud Atlas unreachable (${error?.message || error}).`);
    
    // Try local MongoDB on 27017
    try {
      console.log('[MongoDB] Trying local MongoDB on 127.0.0.1:27017...');
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/gharowa_db', {
        serverSelectionTimeoutMS: 2000,
      });
      isConnected = true;
      console.log('[MongoDB] Connected to local MongoDB instance!');
      return localConn;
    } catch (localErr) {
      console.warn('[MongoDB] Local MongoDB also not detected. Running with in-memory state fallback.');
      isConnected = false;
      return null;
    }
  }
};

export const isDbConnected = () => isConnected;
