import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder, resetOrderState } from '../redux/slices/orderSlice';
import { getFinalPrice } from '../redux/slices/cartSlice';
import { showToast } from '../components/common/Toast';
import AddressForm from '../components/checkout/AddressForm';
import { Lock, ShieldCheck, CreditCard, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading, success, currentOrder, error } = useSelector((state) => state.orders);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/cart');
    }
  }, [items, success, navigate]);

  // Handle successful order creation
  useEffect(() => {
    if (success && currentOrder) {
      const orderId = currentOrder._id;
      dispatch(resetOrderState());
      navigate(`/order-confirmation/${orderId}`);
    }
  }, [success, currentOrder, navigate, dispatch]);

  // Handle server errors
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(resetOrderState());
    }
  }, [error, dispatch]);

  const shippingFee = totalAmount > 1000 || totalAmount === 0 ? 0 : 99.00;
  const finalTotal = totalAmount + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validations
    const isAddressFilled = Object.values(address).every((val) => val.trim() !== '');
    if (!isAddressFilled) {
      showToast('Please fill in all shipping fields', 'warning');
      return;
    }

    // Format items payload
    const orderItems = items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: getFinalPrice(item.price, item.discount),
    }));

    dispatch(
      placeOrder({
        items: orderItems,
        shippingAddress: address,
        totalAmount: finalTotal,
      })
    );
  };

  return (
    <div className="min-h-screen bg-background-primary px-4 sm:px-6 md:px-8 py-12 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Back to Cart & Title */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent-electric hover:text-accent-bright transition-colors"
        >
          <ChevronLeft size={14} /> Back to Cart
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary">
          Checkout Secured
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Address Form (col-span-7) */}
        <div className="lg:col-span-7">
          <AddressForm address={address} onChange={setAddress} />
        </div>

        {/* Right Column: Order Summary & Placement (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-glass border border-borderBlue rounded-xl p-6 space-y-6 shadow-xl sticky top-24">
            <h3 className="text-lg font-bold font-heading text-text-primary border-b border-borderBlue/30 pb-3">
              Confirm Order
            </h3>

            {/* List mini products */}
            <div className="max-h-48 overflow-y-auto divide-y divide-borderBlue/20 pr-1">
              {items.map((item) => {
                const finalPrice = getFinalPrice(item.price, item.discount);
                return (
                  <div key={item.product} className="flex justify-between items-center py-2.5 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-text-primary line-clamp-1">{item.title}</span>
                      <span className="text-text-secondary font-accent">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-accent font-semibold text-text-primary">
                      ₹{(finalPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2.5 font-accent text-xs text-text-secondary border-t border-borderBlue/35 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-borderBlue/20">
                <span className="text-sm font-semibold text-text-primary">Total Amount</span>
                <span className="text-xl font-bold text-accent-electric">
                  ₹{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Simulated Payment Method Badge */}
            <div className="p-3 bg-background-primary border border-borderBlue rounded-lg flex items-center justify-between text-xs font-accent">
              <span className="flex items-center gap-2 text-text-secondary">
                <CreditCard size={14} className="text-accent-electric" />
                Demo Payment Card
              </span>
              <span className="text-text-primary">•••• 4242</span>
            </div>

            {/* Place Order CTA with Lock icon */}
            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent-blue hover:bg-accent-bright hover:shadow-glow text-white font-semibold rounded-lg text-sm transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock size={15} />
              {loading ? 'Processing Order...' : 'Place Secure Order'}
            </button>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-text-secondary">
              <ShieldCheck size={14} className="text-success" />
              <span>Security encryption active. Demo purchase checkout.</span>
            </div>
          </div>
        </div>

      </form>

    </div>
  );
}
