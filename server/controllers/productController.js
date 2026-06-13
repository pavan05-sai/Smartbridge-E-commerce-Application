import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { validationResult } from 'express-validator';

// @desc    Get all products (with search, filter, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = {};

    // Search query
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Sort options
    let sortBy = { createdAt: -1 }; // default: newest
    if (req.query.sort) {
      if (req.query.sort === 'priceAsc') {
        sortBy = { price: 1 };
      } else if (req.query.sort === 'priceDesc') {
        sortBy = { price: -1 };
      } else if (req.query.sort === 'ratings') {
        sortBy = { ratings: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name email avatar')
      .sort(sortBy)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email avatar');

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Get reviews for this product
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name avatar');

    res.json({
      product,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { title, description, price, discount, category, images, stock } = req.body;

    const product = new Product({
      title,
      description,
      price,
      discount: discount || 0,
      category,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
      stock,
      seller: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
export const updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { title, description, price, discount, category, images, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.category = category || product.category;
    if (images) product.images = images;
    product.stock = stock !== undefined ? stock : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }

    // Delete associated reviews first
    await Review.deleteMany({ product: req.params.id });

    // Delete the product itself
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private/Buyer
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400);
      throw new Error('Rating and comment are required');
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Check if buyer has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: req.params.id,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed by you');
    }

    const review = new Review({
      product: req.params.id,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Recalculate ratings
    const reviews = await Review.find({ product: req.params.id });
    product.numReviews = reviews.length;
    product.ratings =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name avatar');
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
