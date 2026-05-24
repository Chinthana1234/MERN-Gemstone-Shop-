import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  registerUser,
  updateUserProfile,
  logoutUser,
  syncLoginUser
} from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(resultAction.payload || 'Login failed');
    }
  };

  const register = async (name, email, password) => {
    const resultAction = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(resultAction.payload || 'Registration failed');
    }
  };

  const updateProfile = async (name, email, password) => {
    const resultAction = await dispatch(updateUserProfile({ name, email, password }));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      throw new Error(resultAction.payload || 'Failed to update profile');
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const syncLogin = (userData) => {
    dispatch(syncLoginUser(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, syncLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
