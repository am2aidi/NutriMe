import React from 'react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { activeTab, setActiveTab, user, auth, logout } = useApp();

  const handleTabClick = (tabId: string) => {
    if (!user.onboarded && tabId !== 'setup') {
      return;
    }
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: 'setup', label: 'Onboarding Setup', icon: 'fa-sliders' },
    { id: 'home', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'plan', label: 'Meal Plan', icon: 'fa-calendar-alt' },
    { id: 'orders', label: 'Restaurant Meals', icon: 'fa-shopping-bag' },
    { id: 'strava', label: 'Strava Tracker', icon: 'fa-bicycle' },
    { id: 'gym', label: 'Gym Hub', icon: 'fa-dumbbell' },
    { id: 'chat', label: 'AI Chatbot', icon: 'fa-robot' },
    { id: 'progress', label: 'Goal Analytics', icon: 'fa-chart-line' },
    { id: 'admin', label: 'Admin Console', icon: 'fa-user-shield' }
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <i className="fas fa-seedling"></i>
        </div>
        <span className="logo-text" style={{ 
          fontSize: '1.5rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 30%, #a7f3d0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-heading)'
        }}>NutriMe</span>
      </div>
      
      <nav style={{ overflowY: 'auto', flex: 1, marginBottom: '1rem' }}>
        <ul className="nav-links">
          {navItems.map(item => {
            const isBlocked = !user.onboarded && item.id !== 'setup';
            const isActive = activeTab === item.id;
            
            return (
              <li 
                key={item.id} 
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ 
                  opacity: isBlocked ? 0.4 : 1,
                  pointerEvents: isBlocked ? 'none' : 'auto'
                }}
              >
                <a className="nav-link" onClick={() => handleTabClick(item.id)}>
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer card */}
      <div className="user-status-card" style={{ gap: '0.5rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <div className="user-avatar" style={{ minWidth: '40px' }}>
            {auth.name ? auth.name[0].toUpperCase() : '?'}
          </div>
          <div className="user-info" style={{ overflow: 'hidden' }}>
            <div className="user-name" style={{ fontSize: '0.85rem' }}>{auth.name || 'Sandbox User'}</div>
            <span className="user-goal-tag" style={{ fontSize: '0.65rem' }}>
              {user.onboarded 
                ? (user.goal === 'loss' ? 'Loss' : user.goal === 'gain' ? 'Gain' : 'Maintenance') 
                : 'Pending'}
            </span>
          </div>
        </div>
        
        {auth.isLoggedIn && (
          <button 
            type="button" 
            title="Log Out"
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-danger)', 
              cursor: 'pointer', 
              fontSize: '1rem',
              padding: '0.25rem'
            }}
            onClick={logout}
          >
            <i className="fas fa-power-off"></i>
          </button>
        )}
      </div>
    </aside>
  );
};
