import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI =
  'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/Gharowa?appName=dawatit';

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = MONGODB_URI || DEFAULT_MONGODB_URI;
  if (!uri) {
    return null;
  }

  // If already connected and ready, reuse existing connection immediately (0ms)
  if ((mongoose.connection.readyState as number) === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 5000,
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        cached.conn = null;
        console.warn('MongoDB connection warning:', err.message);
        return null;
      });
  }

  try {
    const conn = await cached.promise;
    if (!conn || (mongoose.connection.readyState as number) !== 1) {
      cached.promise = null;
      cached.conn = null;
      return null;
    }
    cached.conn = conn;
    return conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    return null;
  }
}
