import { Router } from 'express';
import {
  getPublicCoupons,
  getAllCouponsAdmin,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { couponSchema } from '../validators';

const router = Router();

// Public
router.get('/public', getPublicCoupons);
router.post('/validate', validateCoupon);

// Admin
router.get('/admin', authenticate, authorizeRoles('super_admin', 'manager'), getAllCouponsAdmin);
router.post('/admin', authenticate, authorizeRoles('super_admin', 'manager'), validateBody(couponSchema), createCoupon);
router.put('/admin/:id', authenticate, authorizeRoles('super_admin', 'manager'), updateCoupon);
router.delete('/admin/:id', authenticate, authorizeRoles('super_admin', 'manager'), deleteCoupon);

export default router;
