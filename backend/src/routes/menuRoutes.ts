import { Router } from 'express';
import {
  getMenuCategories,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getAllMenuItemsAdmin,
  getMenuItemBySlug,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
} from '../controllers/menuController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { menuItemSchema } from '../validators';

const router = Router();

// Public routes
router.get('/categories', getMenuCategories);
router.get('/items', getMenuItems);
router.get('/items/:slug', getMenuItemBySlug);

// Admin Category routes
router.get('/admin/categories', authenticate, authorizeRoles('super_admin', 'manager', 'cashier'), getAllCategoriesAdmin);
router.post('/admin/categories', authenticate, authorizeRoles('super_admin', 'manager'), createCategory);
router.put('/admin/categories/:id', authenticate, authorizeRoles('super_admin', 'manager'), updateCategory);
router.delete('/admin/categories/:id', authenticate, authorizeRoles('super_admin', 'manager'), deleteCategory);

// Admin Menu Item routes
router.get('/admin/items', authenticate, authorizeRoles('super_admin', 'manager', 'cashier', 'kitchen_staff'), getAllMenuItemsAdmin);
router.post('/admin/items', authenticate, authorizeRoles('super_admin', 'manager'), validateBody(menuItemSchema), createMenuItem);
router.put('/admin/items/:id', authenticate, authorizeRoles('super_admin', 'manager'), updateMenuItem);
router.patch('/admin/items/:id/availability', authenticate, authorizeRoles('super_admin', 'manager', 'cashier', 'kitchen_staff'), toggleAvailability);
router.delete('/admin/items/:id', authenticate, authorizeRoles('super_admin', 'manager'), deleteMenuItem);

export default router;
