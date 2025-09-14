import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { createClient } from '@supabase/supabase-js';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import EmailAssistant from "./components/EmailAssistant";
import NoteSummarizer from "./components/NoteSummarizer";
import QuizGenerator from "./components/QuizGenerator";
import SearchAssistant from "./components/SearchAssistant";
import FeedbackAssistant from "./components/FeedbackAssistant";
import PromptBuilder from "./components/PromptBuilder";
import Tutorials from "./components/Tutorials";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { tutorials } from "./data/tutorialdata";

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AppContent = () => {
  const { isAuthenticated, loading, user, logToolUsage, updateUserProgress } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState([]);
  const [userStats, setUserStats] = useState(null);

  // Check if we should show TOS or Privacy Policy based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/terms-of-service') {
      setActiveSection('terms-of-service');
    } else if (path === '/privacy-policy') {
      setActiveSection('privacy-policy');
    }
  }, []);

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    return process.env.REACT_APP_SUPABASE_URL && 
           process.env.REACT_APP_SUPABASE_ANON_KEY &&
           process.env.REACT_APP_SUPABASE_URL !== 'https://dummy.supabase.co' &&
           process.env.REACT_APP_SUPABASE_ANON_KEY !== 'dummy_key';
  };

  // Load user progress when user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setCompletedTutorials([]);
        setUserStats(null);
        return;
      }

      try {
        if (user.provider === 'demo') {
          // Demo user - use localStorage
          const progressKey = `user_progress_${user.id}`;
          const sessionsKey = `user_sessions_${user.id}`;
          
          const progress = JSON.parse(localStorage.getItem(progressKey) || '[]');
          const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
          
          setCompletedTutorials(progress);
          
          // Calculate stats
          const toolsUsed = new Set(sessions.map(s => s.tool_used)).size;
          const recentSessions = sessions.slice(-5).reverse();
          
          setUserStats({
            tutorials_completed: progress.length,
            tools_used: toolsUsed,
            total_sessions: sessions.length,
            recent_sessions: recentSessions
          });
          
        } else if (isSupabaseConfigured()) {
          // Supabase user - fetch from database
          await loadSupabaseUserData();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setCompletedTutorials([]);
        setUserStats({
          tutorials_completed: 0,
          tools_used: 0,
          total_sessions: 0,
          recent_sessions: []
        });
      }
    };

    loadUserData();
  }, [user]);

  const loadSupabaseUserData = async () => {
    try {
      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('tutorial_id')
        .eq('user_id', user.id);

      if (!progressError && progressData) {
        const completedIds = progressData.map(item => item.tutorial_id);
        setCompletedTutorials(completedIds);
      }

      // Fetch user sessions for stats
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('tool_used, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!sessionsError && sessionsData) {
        const toolsUsed = new Set(sessionsData.map(s => s.tool_used)).size;
        const recentSessions = sessionsData.slice(0, 5);
        
        setUserStats({
          tutorials_completed: progressData?.length || 0,
          tools_used: toolsUsed,
          total_sessions: sessionsData.length,
          recent_sessions: recentSessions
        });
      }

    } catch (error) {
      console.error('Error loading Supabase user data:', error);
      // Fallback to empty stats
      setUserStats({
        tutorials_completed: 0,
        tools_used: 0,
        total_sessions: 0,
        recent_sessions: []
      });
    }
  };

  // Enhanced tutorial completion handler
  const handleTutorialComplete = async (tutorialId) => {
    if (!user || completedTutorials.includes(tutorialId)) return;

    try {
      const result = await updateUserProgress(tutorialId);
      
      if (result && result.success) {
        setCompletedTutorials(prev => [...prev, tutorialId]);
        
        // Update stats
        if (userStats) {
          setUserStats(prev => ({
            ...prev,
            tutorials_completed: prev.tutorials_completed + 1
          }));
        }
        
        // Show success notification
        showNotification('🎉 Tutorial completed! Progress saved.', 'success');
        
        // Check for achievements
        const newCompletedCount = completedTutorials.length + 1;
        if (newCompletedCount === 6) {
          showNotification('🏆 Achievement Unlocked: Tutorial Master! You\'ve completed all tutorials!', 'achievement');
        } else if (newCompletedCount === 3) {
          showNotification('⭐ Achievement Unlocked: Half Way There!', 'achievement');
        } else if (newCompletedCount === 1) {
          showNotification('🌟 Achievement Unlocked: First Steps!', 'achievement');
        }
        
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error completing tutorial:', error);
      showNotification('❌ Failed to save progress. Please try again.', 'error');
    }
  };

  // Utility function to show notifications
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    let bgColor = 'bg-blue-100 border-blue-400 text-blue-700';
    
    if (type === 'success') {
      bgColor = 'bg-green-100 border-green-400 text-green-700';
    } else if (type === 'error') {
      bgColor = 'bg-red-100 border-red-400 text-red-700';
    } else if (type === 'achievement') {
      bgColor = 'bg-yellow-100 border-yellow-400 text-yellow-700';
    }
    
    notification.className = `fixed top-4 right-4 ${bgColor} px-4 py-3 rounded border z-50 max-w-sm shadow-lg`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, type === 'achievement' ? 5000 : 3000);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading RRC EduAI...</p>
        </div>
      </div>
    );
  }

  // Show TOS or Privacy Policy pages (can be accessed without authentication)
  if (activeSection === 'terms-of-service') {
    return <TermsOfService onBack={() => setActiveSection('dashboard')} />;
  }
  
  if (activeSection === 'privacy-policy') {
    return <PrivacyPolicy onBack={() => setActiveSection('dashboard')} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Enhanced section setter that logs tool usage and checks for achievements
  const setActiveSectionWithLogging = (section) => {
    setActiveSection(section);
    
    // Log tool usage when user navigates to a tool
    const toolSections = [
      'email-assistant',
      'note-summarizer', 
      'quiz-generator',
      'search-assistant',
      'feedback-assistant',
      'prompt-builder'
    ];
    
    if (toolSections.includes(section)) {
      logToolUsage(section, { 
        timestamp: new Date().toISOString(),
        action: 'navigation' 
      });
      
      // Check for tool master achievement
      if (userStats) {
        const usedTools = new Set();
        userStats.recent_sessions?.forEach(session => {
          usedTools.add(session.tool_used);
        });
        usedTools.add(section);
        
        if (usedTools.size === 6) {
          showNotification('🏆 Achievement Unlocked: Tool Master! You\'ve used all available tools!', 'achievement');
        } else if (usedTools.size === 3) {
          showNotification('🔧 Achievement Unlocked: Tool Explorer!', 'achievement');
        }
      }
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard setActiveSection={setActiveSectionWithLogging} />;
      case "email-assistant":
        return <EmailAssistant />;
      case "note-summarizer":
        return <NoteSummarizer />;
      case "quiz-generator":
        return <QuizGenerator />;
      case "search-assistant":
        return <SearchAssistant />;
      case "feedback-assistant":
        return <FeedbackAssistant />;
      case "prompt-builder":
        return <PromptBuilder />;
      case "tutorials":
        return (
          <Tutorials
            completedTutorials={completedTutorials}
            setCompletedTutorials={handleTutorialComplete}
            tutorials={tutorials}
          />
        );
      case "profile":
        return <ProfilePage userStats={userStats} />;
      case "terms-of-service":
        return <TermsOfService onBack={() => setActiveSection('dashboard')} />;
      case "privacy-policy":
        return <PrivacyPolicy onBack={() => setActiveSection('dashboard')} />;
      default:
        return <Dashboard setActiveSection={setActiveSectionWithLogging} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        user={user}
        setActiveSection={setActiveSectionWithLogging}
      />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSectionWithLogging}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          completedTutorials={completedTutorials}
          totalTutorials={tutorials.length}
        />
        <main className="flex-1 lg:ml-0 p-6">{renderActiveSection()}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;