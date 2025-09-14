import React, { useState, useEffect } from 'react';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

// Simple router component for handling TOS and Privacy Policy pages
const SimpleRouter = () => {
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Handle initial path
    setCurrentPath(window.location.pathname);
    
    // Listen for popstate events (back/forward button)
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle navigation
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleBackToApp = () => {
    navigate('/');
    window.location.reload(); // Reload to return to main app
  };

  // Render based on current path
  switch (currentPath) {
    case '/terms-of-service':
      return <TermsOfService onBack={handleBackToApp} />;
    case '/privacy-policy':
      return <PrivacyPolicy onBack={handleBackToApp} />;
    default:
      return null; // Return null to let main app handle
  }
};

// Export navigation helper
export const navigateToPage = (path) => {
  window.history.pushState({}, '', path);
  window.location.reload();
};

export default SimpleRouter;