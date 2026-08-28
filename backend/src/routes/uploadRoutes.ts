import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = Router();

// Admin image upload route
router.post('/', authenticate, authorizeRoles('super_admin', 'manager'), uploadImage);

// Also allow public/client temporary upload if needed
router.post('/public', uploadImage);

export default router;
