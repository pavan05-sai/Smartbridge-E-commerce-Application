# ShopEZ E-Commerce Platform

ShopEZ is a full-featured online shopping marketplace built using the **MERN Stack** (MongoDB, Express, React, Node) with a custom **premium, dark, editorial design system**. 

It features two separate user profiles: **Buyers** (who browse catalog items, review products, manage carts, checkout securely, and track purchases) and **Sellers** (who access dashboard analytics, view monthly earning charts, manage order status logs, and create/edit/delete listings).

---

## ⚡ Design Philosophy

The UI is custom-designed with a dark aesthetic:
- **Primary background:** `#0a0a0f` (Deep Black)
- **Secondary cards:** `#0d1117` / `#111827` (Surface/Glassmorphic)
- **Primary accent:** `#2563eb` / `#60a5fa` (Neon/Bright Blue glows)
- **Typography:** Bold `Space Grotesk` headings mixed with clean `Inter` body text and monospaced `JetBrains Mono` values.
- **Interactions:** Hover glows, staggered fade-in lists, self-drawing SVG checkmark success animations, and interactive cursor-tracking image zooms.

---

## 🛠️ Technology Stack
- **Frontend:** React.js (Vite), Redux Toolkit, React Router DOM v6, Tailwind CSS, Framer Motion, Recharts, Lucide React, Axios.
- **Backend:** Node.js, Express.js, Mongoose, Multer (Local Uploads), JWT, bcryptjs, express-validator.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (version 18+) installed on your machine. You will also need a running [MongoDB](https://www.mongodb.com/try/download/community) instance locally (or an Atlas connection string).

### 1. Installation
Run the root script to install dependencies for the root, backend server, and frontend client folders simultaneously:
```bash
npm run install-all
```

### 2. Seeding the Database
ShopEZ includes a seeder script that populates your database with ready-to-use sample buyer/seller profiles and premium tech listings. To run it:
```bash
npm run seed
```

Once completed, you can log in immediately using these credentials:
- **Seller Account:** `seller@shopez.com` (Password: `password123`)
- **Buyer Account:** `buyer@shopez.com` (Password: `password123`)

### 3. Running the Application
Launch both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:3000`) concurrently from the root directory:
```bash
npm run dev
```

Open `http://localhost:3000` in your web browser to start shopping!

---

## 📂 Project Architecture

```text
shopez/
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, Loader, ProtectedRoute, SkeletonCard, Toast
│   │   │   ├── product/        # ProductCard, ProductGrid, ReviewCard, StarRating, ImageGallery
│   │   │   ├── cart/           # CartItem, CartSummary
│   │   │   ├── checkout/       # AddressForm
│   │   │   └── dashboard/      # StatCard, RevenueChart, OrderTable, ProductManager, SidebarNav
│   │   ├── pages/              # Home, ProductListing, ProductDetail, Cart, Checkout, OrderConfirmation, Login, Register, SellerDashboard, Orders
│   │   ├── redux/              # store.js & Slices (auth, product, cart, order)
│   │   ├── services/           # Axios interceptors (axiosInstance.js)
│   │   └── styles/             # Global CSS scrollbars, glows, skeletons (globals.css)
│   ├── tailwind.config.js      # Color extends mapping (#0a0a0f, #2563eb, etc.)
│   └── vite.config.js          # Port 3000 configuration & backend proxy redirects
│
├── server/                     # Express Node.js Backend
│   ├── config/                 # db.js connection establishment
│   ├── controllers/            # auth, products, orders, and dashboard analytics handlers
│   ├── middleware/             # route protections, role limits, error handlings
│   ├── models/                 # Mongoose schemas (User, Product, Order, Review)
│   ├── routes/                 # Express API endpoints mapping
│   ├── utils/                  # token signing helpers (generateToken.js)
│   └── seeder.js               # Clean db seeding scripts
└── package.json                # Root package concurrently script mappings
```

---

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user (buyer/seller role).
- `POST /api/auth/login` - Authenticate and get a JWT token.

### Products Catalog
- `GET /api/products` - Retrieve list of products with filters (`search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`).
- `GET /api/products/:id` - Fetch single product specs and customer reviews.
- `POST /api/products` - Create product (Sellers only).
- `PUT /api/products/:id` - Edit product specs (Sellers only, ownership checked).
- `DELETE /api/products/:id` - Remove product from database (Sellers only, ownership checked).

### Product Reviews
- `POST /api/products/:id/reviews` - Add a rating (1-5) and feedback comment (Buyers only).
- `GET /api/products/:id/reviews` - Fetch reviews list for a product.

### Order Tracking
- `POST /api/orders` - Place purchase order, checks and decrements product stock (Buyers only).
- `GET /api/orders/my` - Fetch purchase order history list (Buyers only).
- `GET /api/orders/:id` - Fetch order invoice and status tracking specs (Buyers/Sellers only).

### Seller Dashboard Operations
- `GET /api/seller/products` - Fetch listed products by the logged-in seller.
- `GET /api/seller/orders` - Fetch buyer orders containing the seller's listings.
- `PUT /api/seller/orders/:id/status` - Update dispatch status (`pending`, `processing`, `shipped`, `delivered`).
- `GET /api/seller/analytics` - Fetch dashboard analytics (revenues, orders, total products, average ratings, and monthly performance coordinates).

### File Uploads
- `POST /api/upload` - Upload product photos statically via Multer (stored in `server/uploads/`).
