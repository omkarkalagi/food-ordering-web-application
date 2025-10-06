import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout, setLoading } from '../slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, userType } = useSelector((state) => state.auth);

  const login = async (userData) => {
    dispatch(setLoading(true));
    try {
      dispatch(loginSuccess(userData));
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  const isCustomer = userType === 'customer';
  const isRestaurant = userType === 'restaurant';

  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        dispatch(loginSuccess(userData));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  const value = {
    user,
    isAuthenticated,
    userType,
    login,
    logout: logoutUser,
    isCustomer,
    isRestaurant,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
