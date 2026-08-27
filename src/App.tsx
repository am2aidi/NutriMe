import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { MealPlanner } from './components/MealPlanner';
import { Restaurants } from './components/Restaurants';
import { StravaTracker } from './components/StravaTracker';
import { GymHub } from './components/GymHub';
import { AiChatbot } from './components/AiChatbot';
import { Analytics } from './components/Analytics';
import { AdminConsole } from './components/AdminConsole';
import { AuthScreen } from './components/AuthScreen';

const AppContent: React.FC = () => {
  const { activeTab, toasts, removeToast, auth } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If user is not logged in, force the authentication screen
  if (!auth.isLoggedIn) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AuthScreen />
        
        {/* Active Toasts even on login */}
        <div className="toast-container">
          {toasts.map(toast => (
            <div 
              key={toast.id} 
              className={`toast toast-${toast.type}`}
              onClick={() => removeToast(toast.id)}
            >
              <span>{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render correct view panel
  const renderActiveView = () => {
    switch (activeTab) {
      case 'setup':
        return <Onboarding />;
      case 'home':
        return <Dashboard />;
      case 'plan':
        return <MealPlanner />;
      case 'orders':
        return <Restaurants />;
      case 'strava':
        return <StravaTracker />;
      case 'gym':
        return <GymHub />;
      case 'chat':
        return <AiChatbot />;
      case 'progress':
        return <Analytics />;
      case 'admin':
        return <AdminConsole />;
      default:
        return <Onboarding />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Burger Bar Toggler */}
      <button className="mobile-header-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar Navigation */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Panel */}
      <main className="main-content">
        {renderActiveView()}
      </main>

      {/* Toast Notifications Center */}
      <div className="toast-container" id="toastContainer">
        {toasts.map(toast => {
          let iconClass = 'fa-check-circle';
          if (toast.type === 'info') iconClass = 'fa-info-circle';
          if (toast.type === 'warning') iconClass = 'fa-exclamation-triangle';
          if (toast.type === 'danger') iconClass = 'fa-times-circle';
          
          return (
            <div 
              key={toast.id} 
              className={`toast toast-${toast.type}`}
              onClick={() => removeToast(toast.id)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fas ${iconClass}`}></i>
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
