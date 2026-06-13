import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash } from 'lucide-react';
import { clearCart } from '../redux/slices/cartSlice';
import { showToast } from '../components/common/Toast';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to empty your shopping cart?')) {
      dispatch(clearCart());
      showToast('Shopping cart cleared');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-background-primary flex flex-col items-center justify-center p-6 text-center max-w-xl mx-auto space-y-6">
        <div className="p-4 bg-surface rounded-full text-accent-electric border border-borderBlue/50 shadow-glow">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading text-text-primary">Your Cart is Empty</h2>
          <p className="text-sm text-text-secondary">
            Looks like you haven't added anything to your cart yet. Explore our premium collections to get started.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-bright text-white font-medium rounded-lg text-sm transition-all hover:shadow-glow btn-press font-heading"
        >
          <ArrowLeft size={16} />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary px-4 sm:px-6 md:px-8 py-12 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Page Header */}
      <div className="flex justify-between items-baseline border-b border-borderBlue/20 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-text-primary">
            Shopping Cart
          </h1>
          <p className="text-xs text-text-secondary">Manage and review selected items before checkout</p>
        </div>

        <button
          onClick={handleClearCart}
          className="text-xs font-accent text-error hover:underline flex items-center gap-1.5 transition-all p-1"
        >
          <Trash size={13} /> CLEAR CART
        </button>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 60%: Items List (col-span-8) */}
        <div className="lg:col-span-8 card-glass border border-borderBlue/50 rounded-xl p-6 shadow-lg divide-y divide-borderBlue/20">
          {items.map((item) => (
            <CartItem key={item.product} item={item} />
          ))}
        </div>

        {/* Right 40%: Order Summary Sidebar (col-span-4) */}
        <div className="lg:col-span-4">
          <CartSummary items={items} totalAmount={totalAmount} />
        </div>

      </div>

    </div>
  );
}
