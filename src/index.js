import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";

// Simple routing logic
const AppRouter = () => {
  const path = window.location.pathname;

  const handleBackToApp = () => {
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  // Render appropriate component based on path
  switch (path) {
    case '/terms-of-service':
      return <TermsOfService onBack={handleBackToApp} />;
    case '/privacy-policy':
      return <PrivacyPolicy onBack={handleBackToApp} />;
    default:
      return <App />;
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);