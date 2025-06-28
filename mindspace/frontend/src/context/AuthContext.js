import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user data
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setError(null);
    } catch (error) {
      console.error('Get current user error:', error);
      // Token might be invalid, remove it
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // Store token
      localStorage.setItem('token', token);
      
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      const { token, user } = response.data;

      // Store token
      localStorage.setItem('token', token);
      
      // Set token in axios defaults
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from storage
    localStorage.removeItem('token');
    
    // Remove token from axios defaults
    delete api.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.put('/auth/profile', profileData);
      
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    getCurrentUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};