import { Router } from 'express';
import authRoutes from './authRoutes';
import menuRoutes from './menuRoutes';
import orderRoutes from './orderRoutes';
import reservationRoutes from './reservationRoutes';
import inventoryRoutes from './inventoryRoutes';
import couponRoutes from './couponRoutes';
import dashboardRoutes from './dashboardRoutes';
import settingsRoutes from './settingsRoutes';
import customerRoutes from './customerRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/reservations', reservationRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/coupons', couponRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);
router.use('/customers', customerRoutes);
router.use('/upload', uploadRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    restaurant: 'Gharowa Hotel & Restaurant (Since 1972)',
    address: '9/C Motijheel C/A, Dhaka-1000',
  });
});
export default router;
