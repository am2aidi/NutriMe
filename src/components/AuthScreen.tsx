import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthScreen: React.FC = () => {
  const { login, signup } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert("Please fill in all inputs.");
      return;
    }
    if (isLogin) {
      login(email, name || email.split('@')[0]);
    } else {
      signup(email, name);
    }
  };

  const loadSandboxUser = () => {
    login("kigali.chef@nutrime.rw", "Kigali Professional");
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      width: '100%'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: 'white',
            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
            marginBottom: '1rem'
          }}>
            <i className="fas fa-seedling"></i>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'white' }}>Welcome to NutriMe</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Personalized Nutrition & Meal Platform
          </p>
        </div>

        {/* Tab Header */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
          <button 
            type="button"
            className="restaurant-tab-btn"
            style={{ flex: 1, padding: '0.5rem', background: isLogin ? 'rgba(255,255,255,0.05)' : 'none', color: isLogin ? 'white' : 'var(--text-muted)' }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            type="button"
            className="restaurant-tab-btn"
            style={{ flex: 1, padding: '0.5rem', background: !isLogin ? 'rgba(255,255,255,0.05)' : 'none', color: !isLogin ? 'white' : 'var(--text-muted)' }}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {!isLogin && (
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Your Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Jean Luc" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@domain.com" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'} <i className="fas fa-right-to-bracket"></i>
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ height: '1px', flex: 1, background: 'var(--surface-border)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SANDBOX TOOLS</span>
          <div style={{ height: '1px', flex: 1, background: 'var(--surface-border)' }}></div>
        </div>

        <button 
          type="button" 
          className="btn btn-secondary" 
          style={{ width: '100%' }}
          onClick={loadSandboxUser}
        >
          <i className="fas fa-user-gear"></i> Quick Load Sandbox User
        </button>
      </div>
    </div>
  );
};
export default AuthScreen;
