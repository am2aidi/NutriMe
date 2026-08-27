import React from 'react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { activeTab, setActiveTab, user } = useApp();

  const handleTabClick = (tabId: string) => {
    if (!user.onboarded && tabId !== 'setup') {
      // Prevent navigation before setup completes
      return;
    }
    setActiveTab(tabId);
    setSidebarOpen(false); // Close mobile toggles
  };

  const navItems = [
    { id: 'setup', label: 'Onboarding Setup', icon: 'fa-sliders' },
    { id: 'home', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'plan', label: 'Meal Plan', icon: 'fa-calendar-alt' },
    { id: 'orders', label: 'Restaurant Meals', icon: 'fa-shopping-bag' },
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
      
      <nav>
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
      <div className="user-status-card">
        <div className="user-avatar">
          {user.onboarded ? (user.gender === 'male' ? 'M' : 'F') : '?'}
        </div>
        <div className="user-info">
          <div className="user-name">{user.onboarded ? `${user.city} Resident` : 'Sandbox User'}</div>
          <span className="user-goal-tag">
            {user.onboarded 
              ? (user.goal === 'loss' ? 'Weight Loss' : user.goal === 'gain' ? 'Muscle Gain' : 'Maintenance') 
              : 'Pending Setup'}
          </span>
        </div>
      </div>
    </aside>
  );
};
