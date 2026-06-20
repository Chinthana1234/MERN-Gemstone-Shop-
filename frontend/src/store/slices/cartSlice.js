import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

// Async Thunk to fetch updated details for cart items from backend database
export const syncCartItems = createAsyncThunk(
  'cart/syncItems',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const items = state.cart.cartItems;
      if (!items || items.length === 0) return [];

      const promises = items.map(item => API.get(`/products/${item._id}`));
      const results = await Promise.all(promises);
      return results.map(res => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const savedCart = localStorage.getItem('cartItems');
const initialState = {
  cartItems: savedCart ? JSON.parse(savedCart) : [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty = 1 } = action.payload;
      const exists = state.cartItems.find(item => item._id === product._id);
      if (exists) {
        state.cartItems = state.cartItems.map(item =>
          item._id === product._id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        state.cartItems.push({ ...product, qty });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(item => item._id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        state.cartItems = state.cartItems.filter(item => item._id !== productId);
      } else {
        state.cartItems = state.cartItems.map(item =>
          item._id === productId ? { ...item, qty } : item
        );
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem('cartItems', JSON.stringify([]));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartItems.fulfilled, (state, action) => {
        const updatedProducts = action.payload;
        state.cartItems = state.cartItems.map(item => {
          const updated = updatedProducts.find(p => p._id === item._id);
          if (updated) {
            return {
              ...item,
              price: updated.price,
              stock: updated.stock,
              name: updated.name,
              imageUrl: updated.imageUrl,
              category: updated.category
            };
          }
          return item;
        });
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      });
  },
});

// Selectors for derived state
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartCount = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.qty, 0);
export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
