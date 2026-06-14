import dns from 'dns';
dns.setDefaultResultOrder('ipv4first'); // Fix: force IPv4 for SRV DNS on mobile hotspots

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { storage as cloudinaryStorage } from './config/cloudinary.js';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';

// Resolve path for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize env configurations (load from project root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to Database
connectDB();

const app = express();

// Apply CORS & Parser Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const upload = multer({ storage: cloudinaryStorage });

// File Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'Image uploaded successfully',
    url: req.file.path,
  });
});

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'ShopEZ E-Commerce API is running...' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);

// Error Middleware Boundaries
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
