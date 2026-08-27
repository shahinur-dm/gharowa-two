import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { restaurantSettingsSchema } from '../validators';

const router = Router();

// Public read
router.get('/', getSettings);

// Admin update
router.put('/', authenticate, authorizeRoles('super_admin'), validateBody(restaurantSettingsSchema), updateSettings);

export default router;
