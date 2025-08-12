import React from "react";
import { Menu, Brain, Shield, Users } from "lucide-react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <div>
              <img src="./rrc_trans.png"></img>
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">RRC EduAI</h1>
        </div>
      </div>
      <div className="flex items-center space-x-4"></div>
    </header>
  );
};

export default Header;
