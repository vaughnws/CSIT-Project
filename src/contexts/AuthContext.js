// contexts/AuthContext.js - Fixed Email Authentication Issues
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    return process.env.REACT_APP_SUPABASE_URL && 
           process.env.REACT_APP_SUPABASE_ANON_KEY &&
           process.env.REACT_APP_SUPABASE_URL !== 'https://dummy.supabase.co' &&
           process.env.REACT_APP_SUPABASE_ANON_KEY !== 'dummy_key';
  };

  // -----------------------------
  // 1️⃣ Initialize and listen for auth changes - FIXED INFINITE LOADING
  // -----------------------------
  useEffect(() => {
    let isMounted = true;
    let authSubscription = null;

    const initializeAuth = async () => {
      console.log('Initializing auth...');
      
      try {
        // First check for demo user in localStorage
        const demoUserData = localStorage.getItem('demo_user');
        if (demoUserData) {
          const parsedUser = JSON.parse(demoUserData);
          console.log('Demo user found:', parsedUser.email);
          if (isMounted) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            setLoading(false);
            return; // Exit early for demo users
          }
        }

        if (!isSupabaseConfigured()) {
          console.log('Supabase not configured, demo mode only');
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        // Get initial session from Supabase
        console.log('Getting initial session from Supabase...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (session?.user && isMounted) {
          console.log('Found active session for user:', session.user.email);
          await handleSupabaseUser(session.user);
        } else {
          console.log('No active session found');
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener AFTER initialization
    const setupAuthListener = () => {
      if (isSupabaseConfigured()) {
        console.log('Setting up Supabase auth listener...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!isMounted) return;
          
          console.log('Supabase auth event:', event, session?.user?.email);
          
          switch (event) {
            case 'SIGNED_IN':
              if (session?.user) {
                await handleSupabaseUser(session.user);
              }
              break;
            case 'SIGNED_OUT':
              handleSignOut();
              break;
            case 'TOKEN_REFRESHED':
              if (session?.user) {
                await handleSupabaseUser(session.user);
              }
              break;
            case 'INITIAL_SESSION':
              // Skip - handled in initializeAuth
              break;
            default:
              console.log('Unhandled auth event:', event);
          }
        });
        authSubscription = subscription;
      }
    };

    // Initialize auth first, then set up listener
    initializeAuth().then(() => {
      setupAuthListener();
    });

    return () => {
      isMounted = false;
      if (authSubscription) {
        console.log('Cleaning up auth subscription');
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // -----------------------------
  // 2️⃣ Handle Supabase authenticated user
  // -----------------------------
  const handleSupabaseUser = async (authUser) => {
    console.log('Handling Supabase user:', authUser.email);
    
    try {
      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || 
              authUser.user_metadata?.name || 
              authUser.email?.split('@')[0] || 'User',
        avatar: authUser.user_metadata?.avatar_url,
        role: 'student',
        created_at: authUser.created_at || new Date().toISOString(),
        provider: authUser.app_metadata?.provider || 'email',
        email_confirmed: authUser.email_confirmed_at ? true : false
      };

      // Sync to Supabase profiles table
      await syncUserProfile(userData);

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('Supabase user authenticated successfully');
    } catch (error) {
      console.error('Error handling Supabase user:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 3️⃣ Handle sign out
  // -----------------------------
  const handleSignOut = () => {
    console.log('Handling sign out');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('demo_user');
    setLoading(false);
  };

  // -----------------------------
  // 4️⃣ Sync user profile in Supabase
  // -----------------------------
  const syncUserProfile = async (userData) => {
    if (!isSupabaseConfigured()) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar,
          role: userData.role,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error && !error.message.includes('relation') && !error.message.includes('table')) {
        console.warn('Profile sync error:', error);
      }
    } catch (error) {
      console.warn('Profile sync failed:', error);
    }
  };

  // -----------------------------
  // 5️⃣ OAuth Sign In Methods
  // -----------------------------
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured. Please use demo login.' };
    }

    try {
      setLoading(true);
      console.log('Initiating Google sign in...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Google sign in error:', error);
      setLoading(false);
      return { success: false, error: 'Google sign-in failed: ' + error.message };
    }
  };

  const signInWithGitHub = async () => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured. Please use demo login.' };
    }

    try {
      setLoading(true);
      console.log('Initiating GitHub sign in...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('GitHub sign in error:', error);
      setLoading(false);
      return { success: false, error: 'GitHub sign-in failed: ' + error.message };
    }
  };

  // -----------------------------
  // 6️⃣ Email/Password Methods with IMPROVED error handling
  // -----------------------------
  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured. Please use demo login.' };
    }

    try {
      setLoading(true);
      console.log('Signing in with email:', email);

      // Validate input before sending to Supabase
      if (!email || !email.trim()) {
        return { success: false, error: 'Email is required.' };
      }
      
      if (!password || password.length < 1) {
        return { success: false, error: 'Password is required.' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Supabase sign-in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          return { 
            success: false, 
            error: 'Please check your email and click the confirmation link before signing in.',
            needsConfirmation: true 
          };
        }
        
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Invalid email or password') ||
            error.status === 400) {
          return {
            success: false,
            error: 'Invalid email or password. Please check your credentials and try again.'
          };
        }
        
        if (error.message.includes('Too many requests')) {
          return {
            success: false,
            error: 'Too many login attempts. Please wait a few minutes before trying again.'
          };
        }
        
        if (error.message.includes('Email link is invalid or has expired')) {
          return {
            success: false,
            error: 'The sign-in link has expired. Please try signing in again.'
          };
        }
        
        // Generic error fallback
        return {
          success: false,
          error: 'Sign-in failed. Please check your email and password, or try again later.'
        };
      }
      
      if (data.user) {
        console.log('Email sign in successful');
        return { success: true };
      }
      
      throw new Error('Sign in failed - no user data received');
    } catch (error) {
      console.error('Email sign in error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: 'Login failed. Please check your internet connection and try again.'
      };
    }
  };

  const signUpWithEmail = async (email, password, name) => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase not configured. Please use demo login.' };
    }

    try {
      setLoading(true);
      console.log('Signing up with email:', email);

      // Validate input before sending to Supabase
      if (!email || !email.trim()) {
        return { success: false, error: 'Email is required.' };
      }
      
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      
      if (!name || !name.trim()) {
        return { success: false, error: 'Name is required.' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          }
        }
      });

      if (error) {
        console.error('Supabase sign-up error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered') || 
            error.message.includes('A user with this email address has already been registered')) {
          return {
            success: false,
            error: 'An account with this email already exists. Please sign in instead.'
          };
        }
        
        if (error.message.includes('Password should be at least')) {
          return {
            success: false,
            error: 'Password must be at least 6 characters long.'
          };
        }
        
        if (error.message.includes('Signup is disabled')) {
          return {
            success: false,
            error: 'Account registration is currently disabled. Please contact support.'
          };
        }
        
        if (error.message.includes('Invalid email')) {
          return {
            success: false,
            error: 'Please enter a valid email address.'
          };
        }
        
        // Generic error fallback
        return {
          success: false,
          error: 'Registration failed. Please try again or contact support if the problem persists.'
        };
      }
      
      if (data.user) {
        setLoading(false);
        if (!data.user.email_confirmed_at) {
          return { 
            success: true, 
            message: 'Account created successfully! Please check your email for a confirmation link before signing in.',
            needsConfirmation: true
          };
        } else {
          return { success: true, message: 'Account created successfully! You can now sign in.' };
        }
      }
      
      throw new Error('Registration failed - no user data received');
    } catch (error) {
      console.error('Email sign up error:', error);
      setLoading(false);
      return { 
        success: false, 
        error: 'Registration failed. Please check your internet connection and try again.'
      };
    }
  };

  // -----------------------------
  // 7️⃣ Demo login with FALLBACK HANDLING
  // -----------------------------
  const login = async (email, password) => {
    const demoAccounts = {
      'student@rrc.ca': { 
        id: '11111111-1111-1111-1111-111111111111', 
        email: 'student@rrc.ca', 
        name: 'Demo Student',
        role: 'student',
        created_at: new Date().toISOString(),
        provider: 'demo'
      },
      'educator@rrc.ca': { 
        id: '22222222-2222-2222-2222-222222222222', 
        email: 'educator@rrc.ca', 
        name: 'Demo Educator',
        role: 'educator',
        created_at: new Date().toISOString(),
        provider: 'demo'
      },
    };

    // Check for demo accounts first
    if (demoAccounts[email] && password === 'demo123') {
      console.log('Demo login successful for:', email);
      setLoading(true);
      const demoUser = demoAccounts[email];
      setUser(demoUser);
      setIsAuthenticated(true);
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setLoading(false);
      return { success: true, user: demoUser };
    } else {
      // Not a demo account, try Supabase
      return await signInWithEmail(email, password);
    }
  };

  // -----------------------------
  // 8️⃣ Logout
  // -----------------------------
  const logout = async () => {
    try {
      setLoading(true);
      console.log('Logging out...');
      
      if (user?.provider === 'demo') {
        console.log('Demo user logout');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('demo_user');
        setLoading(false);
        return { success: true };
      } else if (isSupabaseConfigured()) {
        console.log('Supabase user logout');
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Supabase logout error:', error);
        }
        return { success: true };
      } else {
        handleSignOut();
        return { success: true };
      }
    } catch (error) {
      console.error('Logout error:', error);
      handleSignOut();
      return { success: true };
    }
  };

  // -----------------------------
  // 9️⃣ User Management
  // -----------------------------
  const updateUser = async (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      
      if (user?.provider === 'demo') {
        setUser(newUserData);
        localStorage.setItem('demo_user', JSON.stringify(newUserData));
      } else if (isSupabaseConfigured()) {
        await syncUserProfile(newUserData);
        setUser(newUserData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      if (user?.provider === 'demo') {
        return;
      } else if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          const refreshedUser = {
            ...user,
            name: data.name,
            avatar: data.avatar_url,
            role: data.role,
          };
          setUser(refreshedUser);
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // -----------------------------
  // 🔟 Progress & Usage tracking
  // -----------------------------
  const updateUserProgress = async (tutorialId) => {
    if (!user) return { success: false };
    
    try {
      if (user.provider === 'demo') {
        const progressKey = `user_progress_${user.id}`;
        const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '[]');
        
        if (!existingProgress.includes(tutorialId)) {
          existingProgress.push(tutorialId);
          localStorage.setItem(progressKey, JSON.stringify(existingProgress));
        }
      } else if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            tutorial_id: tutorialId,
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,tutorial_id'
          });

        if (error && !error.message.includes('relation')) {
          throw error;
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, error: error.message };
    }
  };

  const logToolUsage = async (toolName, sessionData = {}) => {
    if (!user) return;
    
    try {
      if (user.provider === 'demo') {
        const sessionsKey = `user_sessions_${user.id}`;
        const existingSessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        existingSessions.push({
          tool_used: toolName,
          session_data: sessionData,
          created_at: new Date().toISOString()
        });
        
        if (existingSessions.length > 50) {
          existingSessions.splice(0, existingSessions.length - 50);
        }
        
        localStorage.setItem(sessionsKey, JSON.stringify(existingSessions));
      } else if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('user_sessions')
          .insert({
            user_id: user.id,
            tool_used: toolName,
            session_data: sessionData,
            created_at: new Date().toISOString()
          });

        if (error && !error.message.includes('relation')) {
          console.warn('Error logging tool usage:', error);
        }
      }
    } catch (error) {
      console.error('Error logging tool usage:', error);
    }
  };

  const getUserProgress = () => {
    if (!user) return [];
    
    if (user.provider === 'demo') {
      try {
        const progressKey = `user_progress_${user.id}`;
        return JSON.parse(localStorage.getItem(progressKey) || '[]');
      } catch (error) {
        console.error('Error getting demo user progress:', error);
        return [];
      }
    } else {
      return [];
    }
  };

  const getUserSessions = () => {
    if (!user) return [];
    
    if (user.provider === 'demo') {
      try {
        const sessionsKey = `user_sessions_${user.id}`;
        return JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      } catch (error) {
        console.error('Error getting demo user sessions:', error);
        return [];
      }
    } else {
      return [];
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
    updateUser,
    refreshUserData,
    updateUserProgress,
    logToolUsage,
    getUserProgress,
    getUserSessions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};