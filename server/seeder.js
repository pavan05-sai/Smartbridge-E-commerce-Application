import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Product from './models/Product.js';
import Review from './models/Review.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

// Load .env from project root (one level up from server/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Seeding Data
const seedProducts = [
  {
    title: 'CyberGlow Mechanical Keyboard',
    description: 'Ultra-responsive mechanical keyboard with customized tactile blue switches, hot-swappable sockets, and organic sound-absorbing dampeners. Features vibrant, customizable blue per-key lighting options to match your dark desktop theme.',
    price: 12499.00,
    discount: 15,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 12,
    ratings: 4.8,
    numReviews: 4,
  },
  {
    title: 'AeroGrip Ergonomic Wireless Mouse',
    description: 'High-precision wireless gaming mouse equipped with a state-of-the-art optical sensor, up to 26K DPI, and customizable side triggers. Includes a magnetic charging dock emitting a subtle blue ambient glow.',
    price: 7499.00,
    discount: 0,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 25,
    ratings: 4.5,
    numReviews: 2,
  },
  {
    title: 'NeoForce Smart Chronograph',
    description: 'Sleek smart wearable combining a circular AMOLED dial with high-grade titanium construction. Monitors athletic stats, heart rate metrics, and integrates widget sync with standard mobile platforms.',
    price: 20999.00,
    discount: 20,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 8,
    ratings: 4.6,
    numReviews: 5,
  },
  {
    title: 'DarkMatter Minimalist Backpack',
    description: 'Asymmetric, weather-resistant commuter backpack designed for tech enthusiasts. Features dedicated fleece-lined sleeves for laptops, multiple quick-stash pockets, and a clean, tactical aesthetic.',
    price: 9299.00,
    discount: 10,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 15,
    ratings: 4.7,
    numReviews: 3,
  },
  {
    title: 'Eclipse Ambient LED Tube',
    description: 'Vertical ambient table light emitting warm or electric blue hues. Perfect for backing desktop monitors, nightstands, or adding depth to modern visual environments.',
    price: 3799.00,
    discount: 0,
    category: 'Home',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 40,
    ratings: 4.2,
    numReviews: 1,
  },
  {
    title: 'AcousticBound ANC Headphones',
    description: 'Premium over-ear headphones with custom acoustic drivers, hybrid Active Noise Cancellation, and 45-hour battery lifespan. Features matte black earcups and carbon fiber joints.',
    price: 24999.00,
    discount: 25,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    ],
    stock: 10,
    ratings: 4.9,
    numReviews: 6,
  },
  {
    title: 'GlowAura Revitalizing Serum',
    description: 'A premium organic face serum infused with vitamins C and E, hyaluronic acid, and rosehip oil to rejuvenate and brighten your skin. Perfect for daily skin wellness.',
    price: 2499.00,
    discount: 10,
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 30,
    ratings: 4.6,
    numReviews: 8,
  },
  {
    title: 'HerbalZen Essential Oils Pack',
    description: 'Set of 6 organic essential oils including Lavender, Peppermint, Eucalyptus, Tea Tree, Lemongrass, and Orange. Perfect for aromatherapy, diffusers, and skin care.',
    price: 1899.00,
    discount: 0,
    category: 'Beauty',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 25,
    ratings: 4.4,
    numReviews: 3,
  },
  {
    title: 'ApexForce Carbon Badminton Racket',
    description: 'Professional-grade badminton racket made from high-modulus carbon fiber. Lightweight, aerodynamic frame designed for powerful smashes and fast hand speed.',
    price: 4999.00,
    discount: 15,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1616253483914-72288d011f06?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 15,
    ratings: 4.8,
    numReviews: 5,
  },
  {
    title: 'Vanguard Smart Yoga Mat',
    description: 'Premium high-density eco-friendly yoga mat with alignment line markers. Non-slip dual texture provides optimal grip and cushion for intense workouts.',
    price: 2299.00,
    discount: 0,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80'
    ],
    stock: 40,
    ratings: 4.7,
    numReviews: 4,
  }
];

const importData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing records
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();

    console.log('Database collections cleared.');

    // Create Mock Accounts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const sellerUser = await User.create({
      name: 'Vanguard Merchant',
      email: 'seller@shopez.com',
      password: hashedPassword,
      role: 'seller',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vanguard',
    });

    const buyerUser = await User.create({
      name: 'Jane Doe',
      email: 'buyer@shopez.com',
      password: hashedPassword,
      role: 'buyer',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=jane',
    });

    console.log('Accounts created:');
    console.log(`- Seller: seller@shopez.com (password: password123)`);
    console.log(`- Buyer: buyer@shopez.com (password: password123)`);

    // Attach Seller ObjectId to products
    const productsData = seedProducts.map((product) => ({
      ...product,
      seller: sellerUser._id,
    }));

    const insertedProducts = await Product.insertMany(productsData);
    console.log(`${insertedProducts.length} Premium products seeded successfully.`);

    // Add some reviews for the first product to showcase reviews
    const firstProduct = insertedProducts[0];
    await Review.create([
      {
        product: firstProduct._id,
        user: buyerUser._id,
        rating: 5,
        comment: 'Absolutely love the tactile switches! The blue backlights look stunning in a dim room. Highly recommend!',
      }
    ]);
    
    // Update review count on product
    firstProduct.numReviews = 1;
    firstProduct.ratings = 5;
    await firstProduct.save();
    console.log('Sample reviews seeded.');

    console.log('Database seeding finished.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error details: ${error.message}`);
    process.exit(1);
  }
};

importData();
