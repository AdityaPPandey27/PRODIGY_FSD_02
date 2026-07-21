import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for initial auth check
  const [error, setError] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check current auth state by hitting the profile endpoint
  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/profile');
      if (res.data.success) {
        setUser(res.data.data);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Done checking, stop loading
    }
  };

  // Login action
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      
      if (res.data.success) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return true; // Return true so the UI can redirect
      }
    } catch (err) {
      // Extract the error message from our custom backend ErrorResponse
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      return false;
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        checkAuth
      }}
    >
      {/* We only render children if we are done checking initial auth status */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to easily use this context in any component
export const useAuth = () => {
  return useContext(AuthContext);
};