import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config';
import { connectDB, isDbConnected } from './config/db';
import { initSocket } from './sockets';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { MenuItem } from './models';
import { seedDatabase } from './scripts/seed';

const app = express();
const server = http.createServer(app);

// 1. Initialize Socket.IO
initSocket(server);

// 2. Security & Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: [
      config.clientUrl,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(config.cookieSecret));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiter for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// 3. Register Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Gharowa Hotel & Restaurant (Since 1972) API Server',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 4. Centralized Error Handler
app.use(errorHandler);

// 5. Connect Database & Start Server
const startServer = async () => {
  try {
    const conn = await connectDB();

    if (conn) {
      try {
        const itemCount = await MenuItem.countDocuments();
        if (itemCount === 0) {
          console.log('[Server] Database is empty. Seeding initial Gharowa 1972 data...');
          await seedDatabase();
        }
      } catch (e) {
        console.warn('[Server] Auto-seed skipped:', e);
      }
    }

    server.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`  GHAROWA HOTEL & RESTAURANT (SINCE 1972) SERVER     `);
      console.log(`  Status: Running on port ${config.port}             `);
      console.log(`  Environment: ${config.nodeEnv}                     `);
      console.log(`  Client URL: ${config.clientUrl}                    `);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export { app, server };
