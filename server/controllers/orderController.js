import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Buyer
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Check stock availability & decrease stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product ${item.product} not found`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.title}`);
      }
    }

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = new Order({
      buyer: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      paymentStatus: 'paid', // Simulate instant checkout payment success
      orderStatus: 'pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private/Buyer
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate({
        path: 'items.product',
        select: 'title images price discount',
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'title images price discount seller',
      });

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Verify authorized party: either the buyer who bought it OR a seller
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = req.user.role === 'seller';

    if (!isBuyer && !isSeller) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};
