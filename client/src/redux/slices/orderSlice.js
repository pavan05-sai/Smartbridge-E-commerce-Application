import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { clearCart } from './cartSlice';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

// Place an order
export const placeOrder = createAsyncThunk(
  'orders/place',
  async ({ items, shippingAddress, totalAmount }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post('/api/orders', {
        items,
        shippingAddress,
        totalAmount,
      });
      dispatch(clearCart()); // Clear local shopping cart on successful checkout
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch logged-in user's order history
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/orders/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch details for a specific order
export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.error = null;
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
