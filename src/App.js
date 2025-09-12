import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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
import { tutorials } from "./data/tutorialdata";

const AppContent = () => {
  const { isAuthenticated, loading, user, logToolUsage } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState([]);

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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Enhanced section setter that logs tool usage
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
      logToolUsage(section, { timestamp: new Date().toISOString() });
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
            setCompletedTutorials={setCompletedTutorials}
            tutorials={tutorials}
          />
        );
      case "profile":
        return <ProfilePage />;
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