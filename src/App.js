import React, { useState } from "react";
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
import { tutorials } from "./data/tutorialdata";

const App = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Add this state for tracking completed tutorials
  const [completedTutorials, setCompletedTutorials] = useState([]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard setActiveSection={setActiveSection} />;
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
      default:
        return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          completedTutorials={completedTutorials} // Now this will work
          totalTutorials={tutorials.length} // Now this will work
        />
        <main className="flex-1 lg:ml-0 p-6">{renderActiveSection()}</main>
      </div>
    </div>
  );
};

export default App;
