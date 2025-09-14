import React from "react";
import { Play, Mail, ChevronRight, Shield, Users, Brain } from "lucide-react";
import { navigationItems } from "../data/navigation";

const Dashboard = ({ setActiveSection }) => {
  const toolCards = navigationItems.slice(1, 7); // Exclude dashboard and tutorials

  const getToolDescription = (id) => {
    const descriptions = {
      "tutorials": "Learn to use AI tools effectively with step-by-step guidance",
      "email-assistant": "Generate professional emails with AI assistance",
      "note-summarizer": "Summarize lecture notes and extract key points",
      "quiz-generator": "Create quizzes and assignments automatically",
      "search-assistant": "Get research help and citation formatting",
      "feedback-assistant": "Receive constructive feedback on your work",
      
    };
    return descriptions[id] || "";
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to EduAI
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Enhance your educational experience with Tutorials and AI-powered
          tools designed for students, educators, and researchers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveSection("tutorials")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Play className="h-5 w-5" />
            <span>Start Tutorial</span>
          </button>
          <button
            onClick={() => setActiveSection("email-assistant")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Try Email Assistant</span>
          </button>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolCards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.label}
              </h3>
              <p className="text-sm text-gray-600">
                {getToolDescription(item.id)}
              </p>
            </div>
          );
        })}
      </div>

      {/* AI Ethics Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          AI Ethics & Best Practices
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Academic Integrity
            </h4>
            <p className="text-sm text-gray-600">
              Use AI as a learning aid while maintaining honesty in your work
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Collaborative Learning
            </h4>
            <p className="text-sm text-gray-600">
              Enhance collaboration while preserving human creativity
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Critical Thinking
            </h4>
            <p className="text-sm text-gray-600">
              Use AI to augment, not replace, your analytical skills
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
