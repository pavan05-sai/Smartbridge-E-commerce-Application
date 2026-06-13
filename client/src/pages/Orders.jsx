import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyOrders } from '../redux/slices/orderSlice';
import { ShoppingBag, ChevronRight, Truck, Calendar, CreditCard } from 'lucide-react';

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/15 text-success border-success/30';
      case 'shipped':
        return 'bg-warning/15 text-warning border-warning/30';
      case 'processing':
        return 'bg-accent-blue/15 text-accent-electric border-accent-blue/30';
      default:
        return 'bg-text-secondary/15 text-text-secondary border-text-secondary/30';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background-primary">
        <p className="text-xs font-accent uppercase tracking-widest text-accent-electric animate-pulse">
          Loading order history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary px-4 sm:px-6 md:px-8 py-12 max-w-5xl mx-auto space-y-8 text-left">
      
      {/* Header */}
      <div className="border-b border-borderBlue/20 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary">
          My Order History
        </h1>
        <p className="text-xs text-text-secondary">Track the dispatch status of your purchases on ShopEZ</p>
      </div>

      {orders.length === 0 ? (
        <div className="card-glass border border-borderBlue/50 rounded-xl p-8 text-center space-y-4 max-w-md mx-auto">
          <div className="mx-auto w-12 h-12 rounded-full bg-borderBlue/30 text-accent-electric flex items-center justify-center">
            <ShoppingBag size={22} />
          </div>
          <h3 className="text-base font-bold font-heading text-text-primary">No Orders Yet</h3>
          <p className="text-xs text-text-secondary">Explore products and complete checkout to see your purchases here.</p>
          <Link
            to="/products"
            className="inline-block px-4 py-2 bg-accent-blue hover:bg-accent-bright text-white text-xs font-semibold rounded-lg"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="card-glass border border-borderBlue rounded-xl overflow-hidden shadow-lg hover:border-borderBlue/75 transition-colors"
            >
              {/* Top Banner Row */}
              <div className="bg-surface/40 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-borderBlue/30 font-accent text-xs">
                <div className="flex gap-6 flex-wrap">
                  <div>
                    <span className="text-text-secondary block mb-0.5">ORDER ID</span>
                    <span className="font-semibold text-text-primary uppercase">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block mb-0.5">DATE PLACED</span>
                    <span className="font-semibold text-text-primary">{formatDate(order.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-text-secondary block mb-0.5">TOTAL PAID</span>
                    <span className="font-semibold text-text-primary">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-2">
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase ${getStatusStyle(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase bg-success/15 border-success/30 text-success">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items list */}
              <div className="p-6 divide-y divide-borderBlue/10">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
                      alt={item.product?.title}
                      className="h-12 w-12 rounded object-cover border border-borderBlue/50 bg-surface"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary truncate">
                        {item.product?.title || 'ShopEZ Item'}
                      </h4>
                      <p className="text-[11px] font-accent text-text-secondary mt-0.5">
                        Quantity: {item.quantity} @ ₹{item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="text-right font-accent font-semibold text-text-primary text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Shipping Summary */}
              <div className="bg-surface/25 p-4 border-t border-borderBlue/20 px-6 flex items-center justify-between text-xs text-text-secondary flex-wrap gap-2">
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-accent-electric" />
                  Shipping to: {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                </span>
                <span className="flex items-center gap-1.5 font-accent text-[11px]">
                  <CreditCard size={14} className="text-accent-electric" />
                  Payment secured via Demo Card
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
