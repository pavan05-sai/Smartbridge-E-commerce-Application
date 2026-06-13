import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, authorize('buyer'), createOrder);

router.route('/my')
  .get(protect, authorize('buyer'), getMyOrders);

router.route('/:id')
  .get(protect, getOrderById);

export default router;
