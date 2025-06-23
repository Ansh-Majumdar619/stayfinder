import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createBooking,
  getUserBookings,
  cancelBooking, // ← import it
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', auth, createBooking);
router.get('/', auth, getUserBookings);
router.delete('/:id', auth, cancelBooking); // ← add this

export default router;
