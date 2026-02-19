import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      try {
        const decoded = JSON.parse(atob(storedToken.split('.')[1]));
        setUser(decoded);
      } catch (error) {
        console.error('Failed to decode token');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const updateEmail = (newToken, newUserData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, setLoading, isAuthenticated, updateUser, updateEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

