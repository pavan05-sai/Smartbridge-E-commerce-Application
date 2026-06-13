import React from 'react';
import { useDispatch } from 'react-redux';
import { Trash2, Minus, Plus } from 'lucide-react';
import { updateQuantity, removeFromCart, getFinalPrice } from '../../redux/slices/cartSlice';
import { showToast } from '../common/Toast';

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  const finalPrice = getFinalPrice(item.price, item.discount);
  const itemTotal = finalPrice * item.quantity;

  const handleQtyChange = (newQty) => {
    if (newQty < 1) return;
    if (newQty > item.stock) {
      showToast(`Only ${item.stock} units available in stock`, 'warning');
      return;
    }
    dispatch(updateQuantity({ productId: item.product, quantity: newQty }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.product));
    showToast(`Removed "${item.title}" from cart`);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-borderBlue/30 last:border-0">
      {/* Item Image */}
      <img
        src={item.image}
        alt={item.title}
        className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-borderBlue bg-surface/50"
      />

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-semibold text-text-primary truncate">
          {item.title}
        </h4>
        
        {/* Unit Price Info */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xs sm:text-sm font-accent font-semibold text-text-primary">
            ₹{finalPrice.toFixed(2)}
          </span>
          {item.discount > 0 && (
            <span className="text-[10px] sm:text-xs font-accent text-text-secondary line-through">
              ₹{item.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center border border-borderBlue rounded-lg bg-background-primary overflow-hidden">
        <button
          onClick={() => handleQtyChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1.5 sm:p-2 hover:bg-surface text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={12} />
        </button>
        <span className="px-3 text-xs sm:text-sm font-accent font-semibold text-text-primary">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQtyChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="p-1.5 sm:p-2 hover:bg-surface text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Row Total and Remove Action */}
      <div className="text-right flex flex-col items-end gap-1.5 min-w-[70px]">
        <span className="text-sm sm:text-base font-accent font-bold text-text-primary">
          ₹{itemTotal.toFixed(2)}
        </span>
        <button
          onClick={handleRemove}
          className="text-text-secondary hover:text-error transition-colors duration-150 p-1"
          title="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
