import { createSlice } from '@reduxjs/toolkit';

// Calculate final price of a product with discount
const getFinalPrice = (price, discount) => {
  return price - (price * (discount || 0)) / 100;
};

// Recalculate total amount for items
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    const finalPrice = getFinalPrice(item.price, item.discount);
    return sum + finalPrice * item.quantity;
  }, 0);
};

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  items: cartItemsFromStorage,
  totalAmount: calculateTotal(cartItemsFromStorage),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload; // product is an object containing _id, title, price, discount, images, stock
      const qty = quantity || 1;
      
      const existingItem = state.items.find((item) => item.product === product._id);

      if (existingItem) {
        // Limit quantity addition to available stock
        const newQty = existingItem.quantity + qty;
        existingItem.quantity = Math.min(newQty, product.stock);
      } else {
        state.items.push({
          product: product._id,
          title: product.title,
          price: product.price,
          discount: product.discount,
          image: product.images[0],
          stock: product.stock,
          quantity: Math.min(qty, product.stock),
        });
      }

      state.totalAmount = calculateTotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.product !== productId);
      state.totalAmount = calculateTotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      state.totalAmount = calculateTotal(state.items);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
export { getFinalPrice };
