import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getFinalPrice } from '../../redux/slices/cartSlice';

export default function CartSummary({ items, totalAmount }) {
  const navigate = useNavigate();

  // Calculate savings
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountSavings = rawSubtotal - totalAmount;
  
  // Shipping logic
  const shippingFee = totalAmount > 1000 || totalAmount === 0 ? 0 : 99.00;
  const finalTotal = totalAmount + shippingFee;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="card-glass border border-borderBlue rounded-xl p-6 space-y-6 shadow-xl sticky top-24">
      <h3 className="text-lg font-bold font-heading text-text-primary">Order Summary</h3>

      <div className="space-y-3 font-accent text-sm text-text-secondary border-b border-borderBlue/35 pb-4">
        {/* Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-text-primary">₹{rawSubtotal.toFixed(2)}</span>
        </div>

        {/* Savings */}
        {discountSavings > 0 && (
          <div className="flex justify-between text-success">
            <span>Savings</span>
            <span>-₹{discountSavings.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-text-primary">
            {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Final Total */}
      <div className="flex justify-between items-baseline pt-2">
        <span className="text-base font-semibold text-text-primary">Total</span>
        <span className="text-2xl font-accent font-bold text-accent-electric">
          ₹{finalTotal.toFixed(2)}
        </span>
      </div>

      {/* Checkout CTA */}
      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className="w-full flex items-center justify-center gap-2 py-3 bg-accent-blue hover:bg-accent-bright disabled:bg-borderBlue/50 text-white font-medium rounded-lg text-sm transition-all hover:shadow-glow btn-press disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Proceed to Checkout
        <ArrowRight size={16} />
      </button>

      {/* Secure badges */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-text-secondary">
        <ShieldCheck size={14} className="text-success" />
        <span>Secure 256-bit SSL checkout guarantee</span>
      </div>
    </div>
  );
}
