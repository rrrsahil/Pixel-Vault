import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await API.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth verification failed', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      const response = await API.post('/auth/login', formData);

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);

      toast.success('Logged in successfully!');
      return true;

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const response = await API.post('/auth/register', formData);

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);

      toast.success('Account created successfully!');
      return true;

    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out gracefully.');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
