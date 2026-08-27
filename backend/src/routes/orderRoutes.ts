import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getKitchenOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../validators';

const router = Router();

// Public customer order route
router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/track/:orderNumber', getOrderByNumber);
router.get('/details/:id', getOrderById);

// Admin / POS / Kitchen routes
router.get('/', authenticate, authorizeRoles('super_admin', 'manager', 'cashier'), getOrders);
router.get('/kitchen', authenticate, authorizeRoles('super_admin', 'manager', 'cashier', 'kitchen_staff'), getKitchenOrders);
router.patch('/:id/status', authenticate, authorizeRoles('super_admin', 'manager', 'cashier', 'kitchen_staff'), validateBody(updateOrderStatusSchema), updateOrderStatus);

export default router;
