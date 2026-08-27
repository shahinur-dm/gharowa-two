import { Router } from 'express';
import {
  createReservation,
  getReservations,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservationController';
import { authenticate } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';
import { validateBody } from '../middleware/validate';
import { createReservationSchema } from '../validators';

const router = Router();

// Public reservation submission
router.post('/', validateBody(createReservationSchema), createReservation);

// Admin reservation management
router.get('/', authenticate, authorizeRoles('super_admin', 'manager', 'cashier'), getReservations);
router.patch('/:id/status', authenticate, authorizeRoles('super_admin', 'manager', 'cashier'), updateReservationStatus);
router.delete('/:id', authenticate, authorizeRoles('super_admin', 'manager'), deleteReservation);

export default router;
