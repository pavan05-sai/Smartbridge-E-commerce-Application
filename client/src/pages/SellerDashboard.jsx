import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../services/axiosInstance';
import { showToast } from '../components/common/Toast';
import SidebarNav from '../components/dashboard/SidebarNav';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import OrderTable from '../components/dashboard/OrderTable';
import ProductManager from '../components/dashboard/ProductManager';
import { DollarSign, ShoppingBag, Package, Star } from 'lucide-react';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'products' | 'orders'
  const [loading, setLoading] = useState(true);

  // States for stats, chart, orders, and products
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    avgRating: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isAuthenticated || userInfo?.role !== 'seller') {
      navigate('/login');
    }
  }, [isAuthenticated, userInfo, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Execute fetches in parallel
      const [analyticsRes, productsRes, ordersRes] = await Promise.all([
        axiosInstance.get('/api/seller/analytics'),
        axiosInstance.get('/api/seller/products'),
        axiosInstance.get('/api/seller/orders'),
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setChartData(analyticsRes.data.chartData);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Error loading dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && userInfo?.role === 'seller') {
      fetchDashboardData();
    }
  }, [isAuthenticated, userInfo]);

  // Handle customer order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/api/seller/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to "${newStatus}"`);
      // Refresh analytics and order listings
      const [analyticsRes, ordersRes] = await Promise.all([
        axiosInstance.get('/api/seller/analytics'),
        axiosInstance.get('/api/seller/orders'),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setChartData(analyticsRes.data.chartData);
      setOrders(ordersRes.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  if (loading && products.length === 0 && orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background-primary">
        <p className="text-xs font-accent uppercase tracking-widest text-accent-electric animate-pulse">
          Loading Seller Hub...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary flex flex-col md:flex-row">
      
      {/* Left Column: Sidebar (Sticky navigation) */}
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Right Column: Dynamic Tab view content */}
      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto text-left">
        
        {/* Dynamic header title depending on active tab */}
        <div className="flex justify-between items-baseline border-b border-borderBlue/25 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary">
              {activeTab === 'analytics' && 'Operational Analytics'}
              {activeTab === 'products' && 'Product Catalog Inventory'}
              {activeTab === 'orders' && 'Buyer Order Logs'}
            </h1>
            <p className="text-xs text-text-secondary">
              Welcome back, {userInfo?.name || 'Seller'}. Monitoring your ShopEZ performance.
            </p>
          </div>
        </div>

        {/* Tab Content 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics metric grids (4-column layout) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Revenue"
                value={`₹${analytics.totalRevenue.toFixed(2)}`}
                icon={<DollarSign size={18} />}
                trend="+12%"
                borderHighlight="border-t-2 border-t-accent-blue"
              />
              <StatCard
                title="Total Orders"
                value={analytics.totalOrders.toString()}
                icon={<ShoppingBag size={18} />}
                trend="+8%"
                borderHighlight="border-t-2 border-t-success"
              />
              <StatCard
                title="Total Products"
                value={analytics.totalProducts.toString()}
                icon={<Package size={18} />}
                borderHighlight="border-t-2 border-t-accent-electric"
              />
              <StatCard
                title="Avg Rating"
                value={`${analytics.avgRating} / 5`}
                icon={<Star size={18} />}
                borderHighlight="border-t-2 border-t-warning"
              />
            </div>

            {/* Performance charts */}
            <div className="grid grid-cols-1 gap-6">
              <RevenueChart data={chartData} />
            </div>

            {/* Compact list of orders */}
            <OrderTable orders={orders.slice(0, 5)} onStatusUpdate={handleStatusUpdate} />
          </div>
        )}

        {/* Tab Content 2: Products Manager */}
        {activeTab === 'products' && (
          <ProductManager products={products} onRefresh={fetchDashboardData} />
        )}

        {/* Tab Content 3: Orders List Table */}
        {activeTab === 'orders' && (
          <OrderTable orders={orders} onStatusUpdate={handleStatusUpdate} />
        )}

      </main>

    </div>
  );
}
