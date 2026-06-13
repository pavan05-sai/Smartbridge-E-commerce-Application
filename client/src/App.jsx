import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';

export default function App() {
  const location = useLocation();

  // Hide general Navbar & Footer when viewing the Seller Dashboard
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Dynamic Navbar rendering */}
      {!isDashboardRoute && <Navbar />}

      {/* Main Page Layout Wrapper */}
      <div className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Buyer Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:id"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Protected Seller Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Dynamic Footer rendering */}
      {!isDashboardRoute && <Footer />}

      {/* Global Toast Alerts */}
      <Toast />
    </div>
  );
}
