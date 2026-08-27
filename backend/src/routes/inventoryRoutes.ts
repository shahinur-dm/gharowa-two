import { Router } from 'express';
import {
  getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  adjustStock,
  getTransactions,
  deleteInventoryItem,
} from '../controllers/inventoryController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { inventoryItemSchema, inventoryAdjustmentSchema } from '../validators';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('super_admin', 'manager'));

router.get('/items', getInventoryItems);
router.post('/items', validateBody(inventoryItemSchema), createInventoryItem);
router.put('/items/:id', updateInventoryItem);
router.post('/items/:id/adjust', validateBody(inventoryAdjustmentSchema), adjustStock);
router.get('/transactions', getTransactions);
router.delete('/items/:id', authorizeRoles('super_admin'), deleteInventoryItem);

export default router;
