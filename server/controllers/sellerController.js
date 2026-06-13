import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Get all products belonging to the logged-in seller
// @route   GET /api/seller/products
// @access  Private/Seller
export const getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders containing the seller's products
// @route   GET /api/seller/orders
// @access  Private/Seller
export const getSellerOrders = async (req, res, next) => {
  try {
    // 1. Find seller's products
    const sellerProductIds = await Product.find({ seller: req.user._id }).distinct('_id');

    // 2. Find orders containing those products
    const orders = await Order.find({ 'items.product': { $in: sellerProductIds } })
      .populate('buyer', 'name email')
      .populate({
        path: 'items.product',
        select: 'title seller price discount images',
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Seller
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      res.status(400);
      throw new Error('Status is required');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller dashboard analytics
// @route   GET /api/seller/analytics
// @access  Private/Seller
export const getSellerAnalytics = async (req, res, next) => {
  try {
    const sellerId = req.user._id;

    // 1. Fetch products and calculate stats
    const products = await Product.find({ seller: sellerId });
    const totalProducts = products.length;
    
    let avgRating = 0;
    if (totalProducts > 0) {
      const totalRatings = products.reduce((acc, item) => acc + (item.ratings || 0), 0);
      avgRating = Number((totalRatings / totalProducts).toFixed(1));
    }

    // 2. Fetch orders containing these products
    const productIds = products.map(p => p._id);
    const orders = await Order.find({ 'items.product': { $in: productIds } })
      .populate({
        path: 'items.product',
        select: 'seller price discount',
      });

    let totalRevenue = 0;
    let totalOrders = orders.length;

    // Calculate revenue specific to this seller
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product && item.product.seller.toString() === sellerId.toString()) {
          const discountPct = item.product.discount || 0;
          const unitPrice = item.price; // Keep the original order item price record
          totalRevenue += unitPrice * item.quantity;
        }
      });
    });

    // 3. Format monthly chart data for last 6 months
    const monthlyData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months with zero values
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mName = months[d.getMonth()];
      const year = d.getFullYear();
      monthlyData[`${mName} ${year}`] = { name: mName, revenue: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const mName = months[date.getMonth()];
      const year = date.getFullYear();
      const key = `${mName} ${year}`;

      if (monthlyData[key]) {
        monthlyData[key].orders += 1;
        order.items.forEach((item) => {
          if (item.product && item.product.seller.toString() === sellerId.toString()) {
            monthlyData[key].revenue += item.price * item.quantity;
          }
        });
      }
    });

    const chartData = Object.values(monthlyData);

    res.json({
      analytics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        avgRating,
      },
      chartData,
    });
  } catch (error) {
    next(error);
  }
};
