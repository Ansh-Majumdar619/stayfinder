import express from 'express';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';

import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// ─── Public Routes ──────────────────────────────────────────────
router.get('/', getListings);             // GET all listings
router.get('/:id', getListingById);       // GET a single listing by ID

// ─── Protected Routes ───────────────────────────────────────────

// ✅ Create listing with image upload
router.post(
  '/',
  protect,
  upload.array('images', 5),
  createListing
);

// ✅ Update listing with image upload
router.put(
  '/:id',
  protect,
  upload.array('images', 5),  // ⬅️ this was missing
  updateListing
);

// ✅ Delete listing by owner
router.delete('/:id', protect, deleteListing);

export default router;