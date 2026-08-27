import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Onboarding: React.FC = () => {
  const { user, targets, updateUserProfile, finishOnboarding, quickLoadPreset } = useApp();
  const [step, setStep] = useState<number>(1);

  // Mifflin-St Jeor local helper for displaying live BMR calculation on screen
  const getBMR = () => {
    let b = 10 * user.weight + 6.25 * user.height - 5 * user.age;
    if (user.gender === 'male') return Math.round(b + 5);
    if (user.gender === 'female') return Math.round(b - 161);
    return Math.round(b - 78);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <section id="setupView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Personalization Wizard</h1>
          <p>Tell us about your body, location, and fitness goals to construct your target nutrition profile.</p>
        </div>
      </div>
      
      <div className="setup-container card">
        {/* Sandbox Presets */}
        <div className="quick-profiles-container">
          <h4 style={{ fontWeight: 700 }}><i className="fas fa-bolt" style={{ color: 'var(--color-secondary)' }}></i> Quick Sandbox Load Options</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Load a preset simulation profile immediately to test the engine features:
          </p>
          <div className="quick-profiles-grid">
            <button className="btn btn-secondary btn-sm" onClick={() => { quickLoadPreset('loss_kigali'); setStep(4); }}>
              <i className="fas fa-map-pin"></i> Kigali: Loss Target (Rwandan Foods)
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => { quickLoadPreset('athlete_global'); setStep(4); }}>
              <i className="fas fa-globe"></i> International: Muscle Gain Target
            </button>
          </div>
        </div>

        {/* Progress Bar Header */}
        <div className="setup-progress-bar">
          <div 
            className="setup-progress-line" 
            id="setupProgressLine"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          <div className={`setup-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`} id="stepNode1">1</div>
          <div className={`setup-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`} id="stepNode2">2</div>
          <div className={`setup-step-node ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`} id="stepNode3">3</div>
          <div className={`setup-step-node ${step >= 4 ? 'completed' : ''} ${step === 4 ? 'active' : ''}`} id="stepNode4">4</div>
        </div>

        {/* STEP 1: Body Metrics */}
        {step === 1 && (
          <div className="setup-step-card active" id="setupStep1">
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>1. Body & Demographics</h3>
            
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label">Biological Gender (Optional)</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', 
                    padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' 
                  }}>
                    <input 
                      type="radio" 
                      name="setup_gender" 
                      value="male" 
                      checked={user.gender === 'male'} 
                      onChange={() => updateUserProfile({ gender: 'male' })} 
                    /> Male
                  </label>
                  <label style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', 
                    padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' 
                  }}>
                    <input 
                      type="radio" 
                      name="setup_gender" 
                      value="female" 
                      checked={user.gender === 'female'} 
                      onChange={() => updateUserProfile({ gender: 'female' })} 
                    /> Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setup_age">Estimated Age (Years)</label>
                <input 
                  type="number" 
                  id="setup_age" 
                  className="form-input" 
                  value={user.age} 
                  onChange={(e) => updateUserProfile({ age: parseInt(e.target.value) || 28 })} 
                  min="15" 
                  max="100" 
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label" htmlFor="setup_height">Height (cm)</label>
                <input 
                  type="number" 
                  id="setup_height" 
                  className="form-input" 
                  value={user.height} 
                  onChange={(e) => updateUserProfile({ height: parseInt(e.target.value) || 175 })} 
                  min="100" 
                  max="250" 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="setup_weight">Current Weight (kg)</label>
                <input 
                  type="number" 
                  id="setup_weight" 
                  className="form-input" 
                  value={user.weight} 
                  onChange={(e) => updateUserProfile({ weight: parseInt(e.target.value) || 75 })} 
                  min="30" 
                  max="200" 
                />
              </div>
            </div>

            <div className="setup-navigation-btns">
              <span></span>
              <button className="btn btn-primary" onClick={nextStep}>Next Step <i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* STEP 2: Goal and Activity */}
        {step === 2 && (
          <div className="setup-step-card active" id="setupStep2">
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>2. Target Objective & Activity</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              How active is your lifestyle, and what physical baseline targets are we programming?
            </p>
            
            <label className="form-label">Physical Activity Multiplier</label>
            <div className="selection-grid">
              {[
                { id: 'sedentary', title: 'Sedentary', desc: 'Office jobs, little physical exercise.' },
                { id: 'light', title: 'Lightly Active', desc: 'Frequent walking or light training.' },
                { id: 'moderate', title: 'Moderately Active', desc: 'Active job or training 3-5 days/week.' },
                { id: 'very', title: 'Very Active', desc: 'Heavy sports, hard physical labor.' }
              ].map(act => (
                <div 
                  key={act.id} 
                  className={`select-card ${user.activity === act.id ? 'selected' : ''}`}
                  onClick={() => updateUserProfile({ activity: act.id as any })}
                >
                  <span className="select-card-title">{act.title}</span>
                  <span className="select-card-desc">{act.desc}</span>
                </div>
              ))}
            </div>
            
            <label className="form-label">Primary Target Goal</label>
            <div className="selection-grid three-col">
              {[
                { id: 'loss', title: 'Weight Loss', icon: 'fa-arrow-trend-down', color: 'var(--color-primary)', desc: 'Caloric deficit nutrition.' },
                { id: 'maintenance', title: 'Maintenance', icon: 'fa-arrows-left-right', color: 'var(--color-info)', desc: 'Stabilize energy weight.' },
                { id: 'gain', title: 'Muscle Gain', icon: 'fa-arrow-trend-up', color: 'var(--color-secondary)', desc: 'Caloric surplus protein.' }
              ].map(gl => (
                <div 
                  key={gl.id} 
                  className={`select-card ${user.goal === gl.id ? 'selected' : ''}`}
                  onClick={() => updateUserProfile({ goal: gl.id as any })}
                >
                  <span className="select-card-title">
                    <i className={`fas ${gl.icon}`} style={{ color: gl.color }}></i> {gl.title}
                  </span>
                  <span className="select-card-desc">{gl.desc}</span>
                </div>
              ))}
            </div>
            
            <div className="setup-navigation-btns">
              <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Next Step <i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* STEP 3: Location Settings */}
        {step === 3 && (
          <div className="setup-step-card active" id="setupStep3">
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>3. Regional Food Customization</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Standardize nutrition logic, localize the cultural eating habits and available markets.
            </p>
            
            <label className="form-label">Your Location Base</label>
            <div className="selection-grid">
              <div 
                className={`select-card ${user.region === 'rwanda' ? 'selected' : ''}`}
                onClick={() => updateUserProfile({ region: 'rwanda' })}
              >
                <span className="select-card-title">Rwanda (Local Focus)</span>
                <span className="select-card-desc">Preloads local Rwandan foods (Isombe, Matooke, Brochettes) and Kigali restaurant options.</span>
              </div>
              <div 
                className={`select-card ${user.region === 'global' ? 'selected' : ''}`}
                onClick={() => updateUserProfile({ region: 'global' })}
              >
                <span className="select-card-title">Global / Western</span>
                <span className="select-card-desc">Preloads standard international health foods (oatmeal, salmon, chicken breast).</span>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="setup_city">City of Residence</label>
              <input 
                type="text" 
                id="setup_city" 
                className="form-input" 
                value={user.city} 
                onChange={(e) => updateUserProfile({ city: e.target.value })} 
              />
            </div>
            
            <div className="setup-navigation-btns">
              <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Back</button>
              <button className="btn btn-primary" onClick={nextStep}>Review Plan <i className="fas fa-arrow-right"></i></button>
            </div>
          </div>
        )}

        {/* STEP 4: Review Calculations */}
        {step === 4 && (
          <div className="setup-step-card active" id="setupStep4">
            <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>4. Review Calculated Nutrition Blueprint</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Calculated based BMR & BMR adjusted expenditure variables:
            </p>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
              <p>Estimated Basal Metabolic Rate (BMR): <strong>{getBMR()} kcal</strong></p>
              <p>Selected Goal: <strong>{user.goal === 'loss' ? 'Weight Loss (Deficit)' : user.goal === 'gain' ? 'Muscle Gain (Surplus)' : 'Weight Maintenance'}</strong></p>
            </div>
            
            <h4 style={{ marginBottom: '0.75rem', fontWeight: 700 }}>Suggested Daily Target Allocations:</h4>
            <div className="progress-stats-summary" style={{ marginBottom: '2rem' }}>
              <div className="stat-box">
                <h5>CALORIES</h5>
                <p style={{ color: 'var(--color-primary)' }} id="review_cal_val">{targets.calories} kcal</p>
              </div>
              <div className="stat-box">
                <h5>PROTEIN</h5>
                <p style={{ color: 'var(--color-info)' }} id="review_p_val">{targets.protein}g</p>
              </div>
              <div className="stat-box">
                <h5>CARBS / FAT</h5>
                <p style={{ color: 'var(--color-secondary)', fontSize: '1.1rem', lineHeight: '2rem' }} id="review_c_val">{targets.carbs}g</p>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)' }} id="review_f_val">{targets.fat}g</span>
              </div>
              <div className="stat-box" style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ margin: 0 }}>HYDRATION MINIMUM</h5>
                <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-info)' }} id="review_w_val">{(targets.water / 1000).toFixed(1)} Liters</p>
              </div>
            </div>
            
            <div className="setup-navigation-btns">
              <button className="btn btn-secondary" onClick={prevStep}><i className="fas fa-arrow-left"></i> Adjust Metrics</button>
              <button className="btn btn-primary" onClick={finishOnboarding}>Confirm & Build Daily Plan <i className="fas fa-circle-check"></i></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
