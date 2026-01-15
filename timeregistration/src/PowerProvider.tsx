import React from 'react';

// Only import PowerProvider when running in Power Apps context
// For local development, we skip the SDK provider
const isPowerAppsContext = typeof window !== 'undefined' && 
  (window.location.hostname.includes('powerapps') || 
   window.location.search.includes('pac'));

interface PowerProviderProps {
  children: React.ReactNode;
}

const PowerProvider: React.FC<PowerProviderProps> = ({ children }) => {
  // In local development, just render children directly
  if (!isPowerAppsContext) {
    return <>{children}</>;
  }

  // Dynamic import for Power Apps context would go here
  // For now, we'll just render children
  return <>{children}</>;
};

export default PowerProvider;
