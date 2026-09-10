import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI =
  'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/Gharowa?appName=dawatit';

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = MONGODB_URI || DEFAULT_MONGODB_URI;
  if (!uri) {
    return null;
  }

  if ((mongoose.connection.readyState as number) === 1) {
    cached.conn = mongoose;
    return mongoose;
  }

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 60000,
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
        console.warn('MongoDB Atlas connection notice:', err.message);
        return null;
      });
  }

  try {
    const conn = await cached.promise;
    if (!conn || (mongoose.connection.readyState as number) !== 1) {
      cached.promise = null;
      cached.conn = null;
    }
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    return null;
  }
}
