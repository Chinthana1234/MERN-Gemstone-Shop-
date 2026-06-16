import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from './ToastContext';
import {
  fetchWishlist,
  toggleWishlist,
  clearWishlist,
  selectWishlistItems
} from '../store/slices/wishlistSlice';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector(selectWishlistItems);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    } else {
      dispatch(clearWishlist());
    }
  }, [user, dispatch]);

  const handleToggleWishlist = async (productId) => {
    if (!user) {
      toast.warning('Please log in first.');
      return;
    }
    const alreadyInWishlist = isInWishlist(productId);
    await dispatch(toggleWishlist(productId));
    if (alreadyInWishlist) {
      toast.info('Removed from wishlist.');
    } else {
      toast.success('Added to wishlist!');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist: handleToggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
