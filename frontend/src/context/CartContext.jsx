import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from './ToastContext';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  syncCartItems
} from '../store/slices/cartSlice';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const addToCart = (product, qty = 1) => {
    dispatch(addToCartAction({ product, qty }));
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find(i => i._id === productId);
    dispatch(removeFromCartAction(productId));
    if (item) {
      toast.info('Removed from cart.');
    }
  };

  const updateQuantity = (productId, qty) => {
    dispatch(updateQuantityAction({ productId, qty }));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
    toast.info('Cart cleared.');
  };

  const syncCart = () => {
    return dispatch(syncCartItems());
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQuantity, clearCart, syncCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
