import React from 'react';
import { useApp } from '../context/AppContext';

export const Restaurants: React.FC = () => {
  const { restaurants, orders, placeOrder, showToast } = useApp();

  // Find the first active (undelivered) order
  const activeOrder = orders.find(o => o.status !== 'delivered');

  return (
    <section id="ordersView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Restaurant Partner Integrations</h1>
          <p>Order meals matching your calorie/protein targets from Kigali's leading kitchens.</p>
        </div>
      </div>
      
      {/* Live Order Tracking Banner */}
      {activeOrder && (
        <div className="card order-tracker-card" id="liveOrderTrackingContainer" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Live Courier Tracking
              </span>
              <h3 style={{ marginTop: '0.25rem' }}>{activeOrder.foodName}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeOrder.restaurantName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'white' }}>
                <i className="fas fa-motorcycle"></i> {activeOrder.status === 'delivered' ? 'Delivered' : 'In Route'}
              </span>
            </div>
          </div>
          
          <div className="tracking-steps-container">
            <div 
              className="tracking-progress-fill" 
              style={{ width: `${activeOrder.progress}%` }}
            ></div>
            
            {[
              { key: 'received', label: 'Order Sent', icon: 'fa-file-invoice' },
              { key: 'preparing', label: 'Preparing', icon: 'fa-fire-burner' },
              { key: 'dispatched', label: 'Dispatched', icon: 'fa-motorcycle' },
              { key: 'delivered', label: 'Delivered', icon: 'fa-house-chimney-user' }
            ].map((step, idx) => {
              const orderSteps = ['received', 'preparing', 'dispatched', 'delivered'];
              const currentStepIdx = orderSteps.indexOf(activeOrder.status);
              
              let stepClass = '';
              if (idx < currentStepIdx) stepClass = 'completed';
              else if (idx === currentStepIdx) stepClass = 'active';

              return (
                <div key={step.key} className={`tracking-step-node ${stepClass}`}>
                  <div className="tracking-icon-circle"><i className={`fas ${step.icon}`}></i></div>
                  <span className="tracking-step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="restaurants-container">
        <div className="restaurant-tabs">
          <button className="restaurant-tab-btn active">Kigali Partners</button>
          <button 
            className="restaurant-tab-btn" 
            onClick={() => showToast('Global integration partnerships coming soon in Stage 4 Expansion.', 'info')}
          >
            Global (Future Expansion)
          </button>
        </div>
        
        <div className="restaurants-grid">
          {restaurants.map(rest => (
            <div key={rest.id} className="card restaurant-card">
              <div className="restaurant-header-banner">
                <span className="restaurant-badge-tag"><i className="fas fa-star"></i> {rest.rating}</span>
                <div className="restaurant-info-header">
                  <h4 className="restaurant-name">{rest.name}</h4>
                  <div className="restaurant-meta-sub">
                    <span><i className="fas fa-map-marker-alt"></i> {rest.location}</span>
                    <span><i className="far fa-clock"></i> {rest.avgDeliveryTime} mins</span>
                  </div>
                </div>
              </div>
              <div className="restaurant-menu-list">
                <h5 style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  Menu (Calorie Disclosed)
                </h5>
                {rest.menu.map(item => (
                  <div key={item.id} className="menu-item-row">
                    <div className="menu-item-info">
                      <h6>{item.name}</h6>
                      <p>{item.calories} kcal | P: {item.protein}g C: {item.carbs}g F: {item.fat}g</p>
                    </div>
                    <div className="menu-item-actions">
                      <span className="menu-item-price">{item.price} RWF</span>
                      <button className="btn btn-secondary btn-sm" onClick={() => placeOrder(rest.id, item.id, null)}>
                        <i className="fas fa-plus"></i> Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Restaurants;
