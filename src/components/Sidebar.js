import React from "react";
import { X, Target } from "lucide-react";
import { navigationItems } from "../data/navigation";

const Sidebar = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  completedTutorials = [],
  totalTutorials = 6,
}) => {
  // Calculate progress percentage
  const progressPercentage =
    totalTutorials > 0 ? (completedTutorials.length / totalTutorials) * 100 : 0;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors
                    ${
                      activeSection === item.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-blue-700 text-sm font-medium mb-1">
                  <Target className="h-4 w-4" />
                  <span>Learning Progress</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {completedTutorials.length} of {totalTutorials} tutorials
                  completed
                </p>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
