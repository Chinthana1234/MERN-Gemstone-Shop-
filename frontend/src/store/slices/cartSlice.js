import { createSlice } from '@reduxjs/toolkit';

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
});

// Selectors for derived state
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartCount = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.qty, 0);
export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
