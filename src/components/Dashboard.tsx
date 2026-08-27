import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { 
    targets, 
    intake, 
    meals, 
    recovery, 
    foodDatabase, 
    logMealState, 
    substituteMeal, 
    addWater, 
    resetRecovery, 
    showToast 
  } = useApp();

  // Modals state
  const [activeSubstituteMealId, setActiveSubstituteMealId] = useState<string | null>(null);

  // Percent calculations
  const calPercent = Math.min(Math.round((intake.calories / targets.calories) * 100), 100);
  const pPercent = Math.min(Math.round((intake.protein / targets.protein) * 100), 100);
  const cPercent = Math.min(Math.round((intake.carbs / targets.carbs) * 100), 100);
  const fPercent = Math.min(Math.round((intake.fat / targets.fat) * 100), 100);

  // Circle stroke offset properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  // Substitute modal variables
  const substituteMealObj = meals.find(m => m.id === activeSubstituteMealId);
  const eligibleSubstitutes = substituteMealObj 
    ? foodDatabase.filter(food => food.category === substituteMealObj.type && food.id !== substituteMealObj.food.id)
    : [];

  return (
    <section id="homeView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Intake Dashboard</h1>
          <p>Daily progression relative to target macronutrient thresholds.</p>
        </div>
      </div>
      
      {/* Missed Meal Recovery Alerts Banner */}
      {recovery.active && (
        <div className="recovery-alert-box" id="dashboardRecoveryBox">
          <div className="recovery-icon"><i className="fas fa-triangle-exclamation"></i></div>
          <div className="recovery-content">
            <h4>Adaptive Logic Prompt</h4>
            <p>{recovery.message}</p>
            {recovery.skippedMealId && (
              <button className="recovery-btn" onClick={resetRecovery}>Reset to Original Targets</button>
            )}
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Left Card: Progress Rings */}
        <div className="card nutrition-summary-card">
          <div className="circular-progress-container">
            <svg className="svg-ring-container" width="180" height="180">
              <defs>
                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <circle className="svg-ring-bg" cx="90" cy="90" r="80" />
              <circle 
                className="svg-ring-progress" 
                cx="90" 
                cy="90" 
                r="80" 
                strokeDasharray={`${circumference} ${circumference}`} 
                strokeDashoffset={strokeDashoffset} 
              />
            </svg>
            <div className="calories-counter">
              <span className="calories-number" id="dash_kcal_num">{intake.calories}</span>
              <span className="calories-label">of <span id="dash_kcal_target">{targets.calories}</span> kcal</span>
            </div>
          </div>
          
          <div className="macro-breakdown-list">
            {/* Protein */}
            <div className="macro-bar-item">
              <div className="macro-header">
                <div className="macro-label">
                  <div className="macro-dot dot-protein"></div>
                  <span>Protein</span>
                </div>
                <span className="macro-values"><span>{intake.protein}g</span> / {targets.protein}g</span>
              </div>
              <div className="progress-track-bar">
                <div className="progress-fill-bar fill-protein" style={{ width: `${pPercent}%` }}></div>
              </div>
            </div>
            {/* Carbs */}
            <div className="macro-bar-item">
              <div className="macro-header">
                <div className="macro-label">
                  <div className="macro-dot dot-carbs"></div>
                  <span>Carbohydrates</span>
                </div>
                <span className="macro-values"><span>{intake.carbs}g</span> / {targets.carbs}g</span>
              </div>
              <div className="progress-track-bar">
                <div className="progress-fill-bar fill-carbs" style={{ width: `${cPercent}%` }}></div>
              </div>
            </div>
            {/* Fat */}
            <div className="macro-bar-item">
              <div className="macro-header">
                <div className="macro-label">
                  <div className="macro-dot dot-fat"></div>
                  <span>Fats</span>
                </div>
                <span className="macro-values"><span>{intake.fat}g</span> / {targets.fat}g</span>
              </div>
              <div className="progress-track-bar">
                <div className="progress-fill-bar fill-fat" style={{ width: `${fPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Card: Quick Actions */}
        <div className="widgets-grid">
          <div className="card widget-card">
            <div className="widget-header">
              <span className="widget-title">Hydration</span>
              <div className="widget-icon icon-water"><i className="fas fa-glass-water"></i></div>
            </div>
            <div>
              <span className="widget-value">{ (intake.water / 1000).toFixed(1) } L</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: { (targets.water / 1000).toFixed(1) } L</p>
            </div>
            <div className="hydration-controls">
              <button className="btn-glass" onClick={() => addWater(250)}>+250ml</button>
              <button className="btn-glass" onClick={() => addWater(500)}>+500ml</button>
            </div>
          </div>
          
          <div className="card widget-card">
            <div className="widget-header">
              <span className="widget-title">Consistency Streak</span>
              <div className="widget-icon icon-streak"><i className="fas fa-fire"></i></div>
            </div>
            <div>
              <span className="widget-value">{intake.streak} Days</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Adherence over 90%</p>
            </div>
            <button 
              className="widget-action-btn" 
              onClick={() => showToast('Consistency metrics verified! Keep logging meals.', 'info')}
            >
              <i className="fas fa-info-circle"></i> Streak Details
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>Today's Meal Logistics</h3>
      
      {/* Schedule list */}
      <div className="meal-timeline-container">
        {meals.map(meal => {
          let statusClass = '';
          if (meal.status === 'eaten') statusClass = 'logged';
          if (meal.status === 'skipped') statusClass = 'skipped';
          
          let iconName = 'utensils';
          if (meal.type === 'beverage') iconName = 'glass-water';
          if (meal.type === 'snack') iconName = 'apple-whole';

          return (
            <div key={meal.id} className={`card meal-card ${meal.id} ${statusClass}`}>
              <div className="meal-time-indicator">
                <span className="meal-time">{meal.time}</span>
                <div className="meal-icon-box"><i className={`fas fa-${iconName}`}></i></div>
              </div>
              <div className="meal-details">
                <div className="meal-title-row">
                  <h4 className="meal-name">{meal.name}</h4>
                  <span className="meal-calories-badge">{meal.food.calories} kcal</span>
                </div>
                <p className="meal-food-description">{meal.food.name} — {meal.food.serving}</p>
                <div className="meal-macro-pills">
                  <span className="macro-pill protein">P: {meal.food.protein}g</span>
                  <span className="macro-pill carbs">C: {meal.food.carbs}g</span>
                  <span className="macro-pill fat">F: {meal.food.fat}g</span>
                </div>
              </div>
              
              <div className="meal-actions">
                {meal.status === 'pending' ? (
                  <>
                    <button className="btn btn-primary btn-sm" onClick={() => logMealState(meal.id, 'eaten')}><i className="fas fa-check"></i> Eat</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveSubstituteMealId(meal.id)}><i className="fas fa-exchange-alt"></i> Swap</button>
                    <button className="btn btn-danger btn-sm" onClick={() => logMealState(meal.id, 'skipped')}><i className="fas fa-times"></i> Skip</button>
                  </>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => logMealState(meal.id, 'pending')}><i className="fas fa-undo"></i> Undo</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
      MODAL 1: FOOD SUBSTITUTION SWAPS
      ========================================== */}
      {activeSubstituteMealId && substituteMealObj && (
        <div className="modal-overlay">
          <div className="modal-box card">
            <button className="modal-close-btn" onClick={() => setActiveSubstituteMealId(null)}><i className="fas fa-times"></i></button>
            <div className="modal-header">
              <h3>Substitute {substituteMealObj.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Choose a nutritionally equivalent local alternative below to preserve your daily calorie and macronutrient budgets.
              </p>
            </div>
            
            <div className="substitutes-list">
              {eligibleSubstitutes.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  No direct substitutions in local region found. Re-plan or toggle international region in profile.
                </p>
              ) : (
                eligibleSubstitutes.map(food => (
                  <div 
                    key={food.id} 
                    className="substitute-item-card"
                    onClick={() => {
                      substituteMeal(activeSubstituteMealId, food.id);
                      setActiveSubstituteMealId(null);
                    }}
                  >
                    <div className="substitute-info">
                      <h5>{food.name}</h5>
                      <p>{food.serving} — {food.calories} kcal</p>
                    </div>
                    <div className="substitute-macros">
                      <span className="macro-pill protein">P: {food.protein}g</span>
                      <span className="macro-pill carbs">C: {food.carbs}g</span>
                      <span className="macro-pill fat">F: {food.fat}g</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Dashboard;
