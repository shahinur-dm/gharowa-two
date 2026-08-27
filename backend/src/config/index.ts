import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://shahinurdmbd_db_user:#yourself#2023@cluster0.glwlj6v.mongodb.net/gharowa_db?appName=Cluster0',
  jwtSecret: process.env.JWT_SECRET || 'gharowa_secret_jwt_key_1972',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieSecret: process.env.COOKIE_SECRET || 'gharowa_cookie_secret_1972',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '8801973255888',
  restaurantPhone: process.env.RESTAURANT_PHONE || '01973255888',
  adminDefaultEmail: process.env.ADMIN_DEFAULT_EMAIL || 'admin@gharowa.com',
  adminDefaultPassword: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Gharowa1972',
};
