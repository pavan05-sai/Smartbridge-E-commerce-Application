import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { addToCart, getFinalPrice } from '../../redux/slices/cartSlice';
import { showToast } from '../common/Toast';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const finalPrice = getFinalPrice(product.price, product.discount);
  const hasDiscount = product.discount > 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to detail page on button click
    if (product.stock === 0) {
      showToast('Product is out of stock', 'warning');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    showToast(`Added "${product.title}" to cart`);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group block card-glass card-glass-hover rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative flex flex-col h-full"
    >
      {/* Product Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-accent font-bold tracking-wider uppercase bg-accent-blue text-white rounded-full">
          {product.discount}% OFF
        </span>
      )}

      {/* Image Container with Hover Scale */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface/50 border-b border-borderBlue/30">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background-primary/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-md border border-error bg-error/10 text-error font-accent font-semibold text-xs tracking-wider uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-4 flex flex-col flex-1 gap-2.5">
        {/* Category Label */}
        <span className="text-[10px] font-accent text-text-secondary uppercase tracking-widest">
          {product.category}
        </span>

        {/* Product Title */}
        <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-electric transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Rating Row */}
        <div className="flex items-center gap-2">
          <StarRating rating={product.ratings} size={13} />
          <span className="text-xs font-accent text-text-secondary">
            ({product.numReviews})
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto pt-1.5">
          <span className="text-lg font-accent font-bold text-text-primary">
            ₹{finalPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-accent text-text-secondary line-through">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-medium bg-accent-blue hover:bg-accent-bright text-white transition-all duration-200 btn-press disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
