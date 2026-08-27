import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const MealPlanner: React.FC = () => {
  const { meals, foodDatabase, restaurants, substituteMeal, placeOrder } = useApp();
  
  const [activeSubstituteMealId, setActiveSubstituteMealId] = useState<string | null>(null);
  const [activeOrderMealId, setActiveOrderMealId] = useState<string | null>(null);

  // Substitute modal variables
  const substituteMealObj = meals.find(m => m.id === activeSubstituteMealId);
  const eligibleSubstitutes = substituteMealObj 
    ? foodDatabase.filter(food => food.category === substituteMealObj.type && food.id !== substituteMealObj.food.id)
    : [];

  // Order modal variables
  const orderMealObj = meals.find(m => m.id === activeOrderMealId);
  
  // Find matching restaurant dishes (+/- 220 kcal budget)
  const matchingRestaurantMeals = orderMealObj
    ? restaurants.flatMap(rest => 
        rest.menu
          .filter(item => Math.abs(item.calories - orderMealObj.food.calories) <= 220)
          .map(item => ({ rest, item }))
      )
    : [];

  return (
    <section id="planView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Your Nutrition Plan</h1>
          <p>Fully generated daily meal breakdown calculated for your current goals.</p>
        </div>
      </div>
      
      <div id="planDetailsList">
        {meals.map(meal => (
          <div key={meal.id} className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem', marginBottom: '1rem' 
            }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>{meal.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <i className="far fa-clock"></i> Recommended time: {meal.time}
                </span>
              </div>
              <span style={{ 
                background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-primary)', 
                fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.9rem' 
              }}>
                {meal.food.calories} kcal
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', 
                borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', 
                flexDirection: 'column', justifyContent: 'center', textAlign: 'center' 
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Standard Portion</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: '0.25rem 0' }}>{meal.food.serving}</span>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  <div><strong style={{ color: 'var(--color-primary)' }}>{meal.food.protein}g</strong><br />Prot</div>
                  <div><strong style={{ color: 'var(--color-secondary)' }}>{meal.food.carbs}g</strong><br />Carb</div>
                  <div><strong style={{ color: 'var(--color-accent)' }}>{meal.food.fat}g</strong><br />Fat</div>
                </div>
              </div>
              
              <div>
                <h5 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem', color: 'white' }}>{meal.food.name}</h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{meal.food.desc}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveSubstituteMealId(meal.id)}>
                    <i className="fas fa-exchange-alt"></i> Substitute Food
                  </button>
                  <button className="btn btn-accent btn-sm" onClick={() => setActiveOrderMealId(meal.id)}>
                    <i className="fas fa-utensils"></i> Order from Restaurant
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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

      {/* ==========================================
      MODAL 2: RESTAURANT ORDER MATCHING
      ========================================== */}
      {activeOrderMealId && orderMealObj && (
        <div className="modal-overlay">
          <div className="modal-box card" style={{ maxWidth: '600px' }}>
            <button className="modal-close-btn" onClick={() => setActiveOrderMealId(null)}><i className="fas fa-times"></i></button>
            <div className="modal-header">
              <h3>Order Matching {orderMealObj.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                These local partner restaurant meals match your slot target requirement of <strong style={{ color: 'var(--color-primary)' }}>{orderMealObj.food.calories} kcal</strong>.
              </p>
            </div>
            
            <div className="substitutes-list">
              {matchingRestaurantMeals.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  No restaurant meals found matching this target budget of {orderMealObj.food.calories} kcal. Try switching location parameters or customizing the calorie profile.
                </p>
              ) : (
                matchingRestaurantMeals.map(({ rest, item }) => (
                  <div 
                    key={item.id} 
                    className="substitute-item-card"
                    style={{ borderLeft: '3px solid var(--color-primary)' }}
                    onClick={() => {
                      placeOrder(rest.id, item.id, activeOrderMealId);
                      setActiveOrderMealId(null);
                    }}
                  >
                    <div className="substitute-info">
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{rest.name}</span>
                      <h5 style={{ marginTop: '0.1rem' }}>{item.name}</h5>
                      <p>{item.calories} kcal — {item.desc}</p>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'white' }}>{item.price} RWF</span>
                      <button className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                        <i className="fas fa-shopping-cart"></i> Order
                      </button>
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
export default MealPlanner;
