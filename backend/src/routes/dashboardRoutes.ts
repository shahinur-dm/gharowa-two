import { Router } from 'express';
import { getDashboardStats, getReports } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

router.use(authenticate);
router.get('/stats', authorizeRoles('super_admin', 'manager', 'cashier'), getDashboardStats);
router.get('/reports', authorizeRoles('super_admin', 'manager'), getReports);

export default router;
