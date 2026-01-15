import React, { useState } from 'react';
import { FluentProvider, webLightTheme, Button, Text, makeStyles, tokens, shorthands } from '@fluentui/react-components';
import { SignOut24Regular } from '@fluentui/react-icons';
import { LoginScreen } from './components/LoginScreen';
import { Navigation, NavigationTab } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { ManagerDashboardPage } from './pages/ManagerDashboardPage';
import { ManagerReportsPage } from './pages/ManagerReportsPage';
import { User } from './types';
import './App.css';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  header: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: tokens.shadow4,
  },
  headerTitle: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  content: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding(tokens.spacingVerticalXL, tokens.spacingHorizontalXL),
  },
  navigationContainer: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXL, '0'),
  },
  signOutButton: {
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
    },
  },
});

function App() {
  const styles = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  const handleLogin = (email: string, role: 'employee' | 'manager') => {
    // In demo mode, accept any credentials
    const mockUser: User = {
      id: role === 'manager' ? 'manager-001' : '1',
      displayName: role === 'manager' ? 'Sarah Manager' : 'Demo User',
      email: email,
      department: 'Engineering',
      role: role,
    };
    setCurrentUser(mockUser);
    setIsLoggedIn(true);
    
    // Set initial tab based on role
    if (role === 'manager') {
      setCurrentTab('manager-dashboard');
    } else {
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentTab('dashboard');
  };

  const handleStatusChange = () => {
    // Refresh is handled by individual components
    console.log('Status changed');
  };

  if (!isLoggedIn) {
    return (
      <FluentProvider theme={webLightTheme}>
        <LoginScreen onLogin={handleLogin} />
      </FluentProvider>
    );
  }

  const renderPage = () => {
    if (!currentUser) return null;
    
    if (currentUser.role === 'manager') {
      switch (currentTab) {
        case 'manager-dashboard':
          return <ManagerDashboardPage />;
        case 'manager-reports':
          return <ManagerReportsPage />;
        case 'profile':
          return <ProfilePage />;
        default:
          return <ManagerDashboardPage />;
      }
    }
    
    // Employee views
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onStatusChange={handleStatusChange} />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage onStatusChange={handleStatusChange} />;
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Text className={styles.headerTitle}>Time Registration</Text>
          <Button
            appearance="transparent"
            icon={<SignOut24Regular />}
            onClick={handleLogout}
            className={styles.signOutButton}
          >
            Sign Out {currentUser?.displayName && `(${currentUser.displayName})`}
          </Button>
        </header>
        <div className={styles.navigationContainer}>
          <Navigation 
            currentTab={currentTab} 
            onTabChange={setCurrentTab}
            role={currentUser?.role || 'employee'}
          />
        </div>
        <main className={styles.content}>
          {renderPage()}
        </main>
      </div>
    </FluentProvider>
  );
}

export default App;
