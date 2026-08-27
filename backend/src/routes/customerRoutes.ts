import { Router } from 'express';
import { getCustomers, getCustomerById, updateCustomer } from '../controllers/customerController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

router.use(authenticate);
router.use(authorizeRoles('super_admin', 'manager', 'cashier'));

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);

export default router;
