import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

const productValidation = [
  check('title', 'Title is required').not().isEmpty().trim(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required and must be a positive number').isFloat({ min: 0 }),
  check('discount', 'Discount must be between 0 and 100').optional().isFloat({ min: 0, max: 100 }),
  check('category', 'Category is required').not().isEmpty().trim(),
  check('stock', 'Stock is required and must be a non-negative integer').isInt({ min: 0 }),
];

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller'), productValidation, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('seller'), productValidation, updateProduct)
  .delete(protect, authorize('seller'), deleteProduct);

router.route('/:id/reviews')
  .get(getProductReviews)
  .post(protect, authorize('buyer'), createProductReview);

export default router;
