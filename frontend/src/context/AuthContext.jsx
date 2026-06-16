import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from './ToastContext';
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
  const { toast } = useToast();
  const { user, loading } = useSelector((state) => state.auth);

  const login = async (email, password) => {
    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Logged in successfully!');
      return resultAction.payload;
    } else {
      const errMsg = resultAction.payload || 'Login failed';
      toast.error('Login failed.');
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password) => {
    const resultAction = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Account created!');
      return resultAction.payload;
    } else {
      const errMsg = resultAction.payload || 'Registration failed';
      toast.error('Registration failed.');
      throw new Error(errMsg);
    }
  };

  const updateProfile = async (name, email, password) => {
    const resultAction = await dispatch(updateUserProfile({ name, email, password }));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      toast.success('Profile updated.');
      return resultAction.payload;
    } else {
      const errMsg = resultAction.payload || 'Failed to update profile';
      toast.error('Update failed.');
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    dispatch(logoutUser());
    toast.success('Logged out.');
  };

  const syncLogin = (userData) => {
    dispatch(syncLoginUser(userData));
    toast.success('Logged in successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, syncLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
