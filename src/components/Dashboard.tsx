import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { FoodItem } from '../types';

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
    showToast,
    user,
    changeSubscriptionTier,
    healthStats,
    syncHealthApp
  } = useApp();

  // Modals & Scanners state
  const [activeSubstituteMealId, setActiveSubstituteMealId] = useState<string | null>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  
  // Photo scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);

  // Pre-meal Chef checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Verify ingredients are fresh & local", checked: false },
    { id: 2, text: "Exclude peanut oils (Allergy Safety)", checked: false },
    { id: 3, text: "Weigh carb portion (Steamed sweet potato/Matooke)", checked: false },
    { id: 4, text: "Ensure protein portions meet target budgets", checked: false }
  ]);

  // Calorie calculations
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

  const handleToggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Simulated Camera Photo Food Scanner
  const handlePhotoUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsScanning(true);
    setScannedFood(null);

    // 2-second scanning simulation
    setTimeout(() => {
      setIsScanning(false);
      // Pick a suitable food item from DB based on user region
      const regionalFoods = foodDatabase.filter(f => f.region === user.region);
      const randomFood = regionalFoods[Math.floor(Math.random() * regionalFoods.length)] || foodDatabase[0];
      
      setScannedFood(randomFood);
      showToast(`Plate analyzed! Detected: ${randomFood.name}`, 'info');
    }, 2000);
  };

  const logScannedMeal = () => {
    if (!scannedFood) return;
    
    // Log the scanned food directly into the current pending meal slot or snacks
    const targetMealId = meals.find(m => m.status === 'pending')?.id || 'snack_afternoon';
    const meal = meals.find(m => m.id === targetMealId);
    
    if (meal) {
      meal.food = scannedFood;
      logMealState(targetMealId, 'eaten');
      setScannedFood(null);
    }
  };

  return (
    <section id="homeView" className="view-section">
      
      {/* Header bar showing subscription tier */}
      <div className="content-header">
        <div className="header-title-container">
          <h1>Intake Dashboard</h1>
          <p>Daily progression relative to target macronutrient thresholds.</p>
        </div>
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--surface-border)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subscription:</span>
            <span style={{ 
              fontWeight: 700, 
              fontSize: '0.85rem',
              color: user.subscriptionTier === 'free' ? 'white' : 'var(--color-primary)',
              textTransform: 'uppercase'
            }}>
              {user.subscriptionTier === 'free' ? 'Free Plan' : user.subscriptionTier === 'premium' ? 'Premium (2K RWF)' : 'Ultimate (5K RWF)'}
            </span>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => setShowBillingModal(true)}
            >
              Upgrade
            </button>
          </div>
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

      {/* Grid: Nutrition circle, Linear bars, streaking, water */}
      <div className="dashboard-grid">
        <div className="card nutrition-summary-card">
          <div className="circular-progress-container">
            <svg className="svg-ring-container" width="180" height="180">
              <circle className="svg-ring-bg" cx="90" cy="90" r="80" />
              <circle 
                className="svg-ring-progress" 
                cx="90" 
                cy="90" 
                r="80" 
                stroke="url(#emeraldGradient)"
                strokeDasharray={`${circumference} ${circumference}`} 
                strokeDashoffset={strokeDashoffset} 
              />
            </svg>
            <div className="calories-counter">
              <span className="calories-number" id="dash_kcal_num">{intake.calories}</span>
              <span className="calories-label">of <span id="dash_kcal_target">{targets.calories}</span> kcal</span>
              {targets.burnedCalories > 0 && (
                <span style={{ fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                  +{targets.burnedCalories} kcal active burn
                </span>
              )}
            </div>
          </div>
          
          <div className="macro-breakdown-list">
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
        
        <div className="widgets-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="card widget-card">
            <div className="widget-header">
              <span className="widget-title">Hydration Log</span>
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

          <div className="card widget-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="widget-header">
              <span className="widget-title">Health App Sync</span>
              <div className="widget-icon icon-streak" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)' }}><i className="fas fa-heartpulse"></i></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.2rem', margin: '0.5rem 0' }}>
              <div>Steps: <strong style={{ color: 'white' }}>{healthStats.steps}</strong></div>
              <div>Sleep: <strong style={{ color: 'white' }}>{healthStats.sleepHours} hrs</strong></div>
              <div>Resting HR: <strong style={{ color: 'white' }}>{healthStats.restingHeartRate} bpm</strong></div>
            </div>
            <button 
              type="button"
              className="widget-action-btn" 
              onClick={syncHealthApp}
              style={{ color: 'var(--color-info)' }}
            >
              <i className="fas fa-arrows-spin"></i> Sync Fit ({healthStats.lastSynced})
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Grid: Food photo scanner & Pre-meal Chef Advisor */}
      <div className="responsive-grid-split" style={{ gridTemplateColumns: '1.2fr 1.8fr', marginBottom: '2rem' }}>
        
        {/* Module A: Mock Food Camera Photo Scanner */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-camera" style={{ color: 'var(--color-primary)' }}></i> AI Food Scanner Camera
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Snap a picture of your dish to instantly analyze and log ingredients.
            </p>
            
            <div style={{
              border: '2px dashed var(--surface-border)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.01)',
              position: 'relative',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}>
              <input 
                type="file" 
                accept="image/*" 
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                onChange={handlePhotoUploadMock}
                disabled={isScanning}
              />
              
              {isScanning ? (
                <div>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Analyzing plate contents...</p>
                </div>
              ) : scannedFood ? (
                <div>
                  <i className="fas fa-circle-check" style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{scannedFood.name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Est: {scannedFood.calories} kcal | P:{scannedFood.protein}g C:{scannedFood.carbs}g F:{scannedFood.fat}g
                  </p>
                </div>
              ) : (
                <div>
                  <i className="fas fa-cloud-arrow-up" style={{ fontSize: '2.2rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}></i>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload Food Photo / Scan Plate</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Camera simulation scanner</p>
                </div>
              )}
            </div>
          </div>
          
          {scannedFood && (
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={logScannedMeal}>
              Log Scanned Food <i className="fas fa-circle-plus"></i>
            </button>
          )}
        </div>

        {/* Module B: Pre-meal Chef Advisor Checklist */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
              <i className="fas fa-utensils" style={{ color: 'var(--color-secondary)' }}></i> Pre-Meal Chef Advisor
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Allergy status: <strong style={{ color: 'var(--color-danger)' }}>Peanut-Free Excluded</strong>
            </span>
          </div>

          {user.medicalConditions.length > 0 && (
            <div style={{ 
              marginBottom: '1.25rem', 
              padding: '0.75rem 1rem', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem'
            }}>
              <span style={{ fontWeight: 800, color: 'var(--color-danger)', display: 'block', marginBottom: '0.25rem' }}>
                <i className="fas fa-hand-holding-medical"></i> CLINICAL PROTOCOLS ACTIVE
              </span>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem', margin: 0 }}>
                {user.medicalConditions.includes('diabetes') && (
                  <li><strong>Diabetic Glycemic Protocol:</strong> Carbohydrates restricted to low-glycemic, slow-release fibers. Strictly exclude refined sugars, sweet juices, or heavy white Ugali.</li>
                )}
                {user.medicalConditions.includes('hypertension') && (
                  <li><strong>Low-Sodium Guidelines:</strong> Limit processed condiments, stock powders, or added table salt to maintain blood pressure parameters.</li>
                )}
                {user.medicalConditions.includes('celiac') && (
                  <li><strong>Gluten-Free Safety:</strong> Wheat, barley, rye ingredients banned. Rely on local potatoes, yams, or rice options.</li>
                )}
                {user.medicalConditions.includes('lactose') && (
                  <li><strong>Lactose Exclusion:</strong> Avoid animal milk or dairy creamers. Substitute with coconut milk or water hydration.</li>
                )}
              </ul>
            </div>
          )}

          <div className="responsive-grid-split" style={{ gridTemplateColumns: '1.2fr 1.8fr' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Target Budget</span>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: '0.2rem 0' }}>{Math.round(targets.calories * 0.35)} kcal</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Next lunch meal should target lean proteins with complex fibers.
              </p>
            </div>
            
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', display: 'block', marginBottom: '0.5rem' }}>Preparation Checks</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {checklist.map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={item.checked} 
                      onChange={() => handleToggleChecklist(item.id)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
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
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
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

      {/* ==========================================
      MODAL 2: SUBSCRIPTION BILLING TIERS
      ========================================== --> */}
      {showBillingModal && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <div className="modal-box card" style={{ maxWidth: '580px' }}>
            <button className="modal-close-btn" onClick={() => setShowBillingModal(false)}><i className="fas fa-times"></i></button>
            <div className="modal-header" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Upgrade Plan</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', marginTop: '0.25rem' }}>Ecosystem Subscriptions</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Unlock personalized meal matching, active tracking overlays, and live Gemini AI channels.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Free Plan */}
              <div 
                style={{
                  border: `1px solid ${user.subscriptionTier === 'free' ? 'var(--color-primary)' : 'var(--surface-border)'}`,
                  background: user.subscriptionTier === 'free' ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => { changeSubscriptionTier('free'); setShowBillingModal(false); }}
              >
                <div>
                  <h4 style={{ fontWeight: 700, color: 'white' }}>Free Tier</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Basic calorie counts & local foods database.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>0 RWF</span>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Forever</p>
                </div>
              </div>

              {/* Premium Plan */}
              <div 
                style={{
                  border: `1px solid ${user.subscriptionTier === 'premium' ? 'var(--color-primary)' : 'var(--surface-border)'}`,
                  background: user.subscriptionTier === 'premium' ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => { changeSubscriptionTier('premium'); setShowBillingModal(false); }}
              >
                <div>
                  <h4 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Premium Plan <i className="fas fa-crown" style={{ color: 'var(--color-accent)', fontSize: '0.85rem' }}></i>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Advanced meal substitutes, missed meal adjustments, & basic AI advice.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)' }}>2,000 RWF</span>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Monthly subscription</p>
                </div>
              </div>

              {/* Ultimate Plan */}
              <div 
                style={{
                  border: `1px solid ${user.subscriptionTier === 'ultimate' ? 'var(--color-primary)' : 'var(--surface-border)'}`,
                  background: user.subscriptionTier === 'ultimate' ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => { changeSubscriptionTier('ultimate'); setShowBillingModal(false); }}
              >
                <div>
                  <h4 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Ultimate Ecosystem <i className="fas fa-bolt" style={{ color: 'var(--color-secondary)', fontSize: '0.85rem' }}></i>
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ecosystem activity trackings, live Gemini AI bot console, & restaurant menus integration.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-secondary)' }}>5,000 RWF</span>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Monthly subscription</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Dashboard;
