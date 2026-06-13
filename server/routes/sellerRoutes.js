import express from 'express';
import {
  getSellerProducts,
  getSellerOrders,
  updateOrderStatus,
  getSellerAnalytics,
} from '../controllers/sellerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Apply security to all routes in this router
router.use(protect);
router.use(authorize('seller'));

router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/analytics', getSellerAnalytics);

export default router;
