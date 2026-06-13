import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

const initialFilters = {
  search: '',
  category: 'All',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
  page: 1,
};

const initialState = {
  products: [],
  currentProduct: null,
  reviews: [],
  filters: initialFilters,
  pagination: {
    page: 1,
    pages: 1,
    totalProducts: 0,
  },
  loading: false,
  error: null,
};

// Fetch products based on filters
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const { search, category, minPrice, maxPrice, sort, page } = filters;
      let url = `/api/products?page=${page}`;
      
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (sort) url += `&sort=${sort}`;

      const response = await axiosInstance.get(url);
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

// Fetch product details
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/products/${id}`);
      return response.data; // contains { product, reviews }
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Submit product review
export const submitReview = createAsyncThunk(
  'products/submitReview',
  async ({ productId, rating, comment }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(`/api/products/${productId}/reviews`, { rating, comment });
      dispatch(fetchProductDetails(productId)); // Reload details to fetch recalculated ratings
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

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 }; // Reset to page 1 on filter change
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    clearProductDetails: (state) => {
      state.currentProduct = null;
      state.reviews = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          totalProducts: action.payload.totalProducts,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload.product;
        state.reviews = action.payload.reviews;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, setPage, resetFilters, clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
