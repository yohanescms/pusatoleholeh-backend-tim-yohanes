// routes/category.js
import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.js';
import { safeRoute, verifyRole } from '../middlewares/middleware.js';

const router = express.Router();

// Buyer/Admin routes
router.post('/', safeRoute, verifyRole('admin'), createCategory); // Hanya admin yang bisa membuat kategori
router.get('/', safeRoute, getAllCategories); // Siapa saja bisa melihat kategori
router.get('/:id', safeRoute, getCategoryById); // Detail kategori
router.put('/:id', safeRoute, verifyRole('admin'), updateCategory); // Admin update kategori
router.delete('/:id', safeRoute, verifyRole('admin'), deleteCategory); // Admin hapus kategori

export default router;
