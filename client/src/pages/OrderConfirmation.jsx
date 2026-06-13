import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Check } from 'lucide-react';

export default function OrderConfirmation() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const drawCheckmark = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.2, type: 'spring', duration: 0.8, bounce: 0 },
        opacity: { delay: 0.2, duration: 0.01 }
      }
    }
  };

  const drawCircle = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: 'spring', duration: 0.8, bounce: 0 },
        opacity: { duration: 0.01 }
      }
    }
  };

  if (loading && !currentOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background-primary">
        <p className="text-text-secondary text-xs uppercase tracking-widest animate-pulse font-accent">
          Loading order details...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary px-4 sm:px-6 md:px-8 py-16 flex items-center justify-center">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Animated Checkmark Drawer */}
        <div className="flex justify-center">
          <div className="relative h-20 w-20 flex items-center justify-center">
            {/* Pulsating green outer shadow */}
            <div className="absolute inset-0 bg-success/10 rounded-full blur-xl animate-pulse"></div>
            
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              className="text-success fill-transparent stroke-success stroke-[4px]"
            >
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                variants={drawCircle}
                initial="hidden"
                animate="visible"
                strokeLinecap="round"
              />
              <motion.path
                d="M25 40 L35 50 L55 30"
                variants={drawCheckmark}
                initial="hidden"
                animate="visible"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Status titles */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-heading text-text-primary tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-sm text-text-secondary">
            Your transaction was successful. We have sent a confirmation email.
          </p>
        </div>

        {/* Monospace Order ID Display */}
        {currentOrder && (
          <div className="card-glass border border-borderBlue/60 rounded-xl p-5 text-left space-y-4 shadow-lg">
            <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-borderBlue/30">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-accent">Order ID</span>
                <span className="text-sm font-accent font-semibold text-accent-electric">
                  {currentOrder._id.toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-accent">Status</span>
                <span className="px-2 py-0.5 rounded bg-success/15 border border-success/30 text-success text-[10px] font-accent uppercase font-semibold">
                  {currentOrder.paymentStatus}
                </span>
              </div>
            </div>

            {/* Simple summaries list */}
            <div className="space-y-2 max-h-40 overflow-y-auto divide-y divide-borderBlue/10 pr-1 text-xs">
              {currentOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 text-text-secondary">
                  <span className="line-clamp-1 max-w-[250px]">{item.product?.title || 'Purchased Item'}</span>
                  <span className="font-accent">
                    ₹{item.price.toFixed(2)} x {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-3 border-t border-borderBlue/20 font-accent">
              <span className="text-xs text-text-primary font-semibold">Grand Total Paid</span>
              <span className="text-lg font-bold text-text-primary">
                ₹{currentOrder.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 border border-borderBlue bg-surface hover:bg-borderBlue/20 text-text-primary font-semibold rounded-lg text-sm transition-all btn-press font-heading"
          >
            Track My Orders
          </Link>
          
          <Link
            to="/products"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-bright text-white font-semibold rounded-lg text-sm transition-all hover:shadow-glow btn-press font-heading"
          >
            Continue Shopping
            <ShoppingBag size={15} />
          </Link>
        </div>

      </div>
    </div>
  );
}
