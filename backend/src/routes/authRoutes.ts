import { Router } from 'express';
import { login, logout, getMe, getStaffList, createStaff } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { loginSchema } from '../validators';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.get('/staff', authenticate, authorizeRoles('super_admin', 'manager'), getStaffList);
router.post('/staff', authenticate, authorizeRoles('super_admin'), createStaff);

export default router;
