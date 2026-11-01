import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('payflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('payflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await axiosClient.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('payflow_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('[Auth check failed]', err);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;

    setToken(newToken);
    setUser(userData);
    localStorage.setItem('payflow_token', newToken);
    localStorage.setItem('payflow_user', JSON.stringify(userData));

    return userData;
  };

  const signup = async (formData) => {
    const res = await axiosClient.post('/auth/signup', formData);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('payflow_token');
    localStorage.removeItem('payflow_user');
  };

  const updateUserSettings = (newSettings) => {
    if (user) {
      const updated = { ...user, settings: { ...user.settings, ...newSettings } };
      setUser(updated);
      localStorage.setItem('payflow_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        updateUserSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
