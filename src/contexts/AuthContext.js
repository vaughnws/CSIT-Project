// contexts/AuthContext.js
// 
// FIX THIS FILE TO INTEGRATE WITH STACK AUTH
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Stack Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already logged in via Stack Auth
        const stackUser = await getStackUser();
        if (stackUser) {
          await handleUserLogin(stackUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const getStackUser = async () => {
    try {
      // This would integrate with Stack Auth SDK
      // For now, we'll simulate with localStorage
      const userData = localStorage.getItem('stack_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting Stack user:', error);
      return null;
    }
  };

  const handleUserLogin = async (stackUser) => {
    try {
      // Create or update user in our database
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stackUserId: stackUser.id,
          email: stackUser.email,
          name: stackUser.displayName || stackUser.email.split('@')[0],
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error syncing user:', error);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Here you would integrate with Stack Auth login
      // For demo purposes, we'll simulate a login
      const mockStackUser = {
        id: 'stack_' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };

      // Store in localStorage (in real app, Stack Auth would handle this)
      localStorage.setItem('stack_user', JSON.stringify(mockStackUser));
      
      await handleUserLogin(mockStackUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Clear Stack Auth session
      localStorage.removeItem('stack_user');
      
      // Clear our app state
      setUser(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProgress = async (tutorialId) => {
    if (!user) return;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          tutorialId: tutorialId,
        }),
      });

      if (response.ok) {
        // Update local user state if needed
        const updatedProgress = await response.json();
        setUser(prev => ({
          ...prev,
          progress: updatedProgress
        }));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const logToolUsage = async (toolName, sessionData = {}) => {
    if (!user) return;

    try {
      await fetch('/api/user/log-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          toolUsed: toolName,
          sessionData: sessionData,
        }),
      });
    } catch (error) {
      console.error('Error logging tool usage:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUserProgress,
    logToolUsage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};