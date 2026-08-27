import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminConsole: React.FC = () => {
  const { foodDatabase, orders, addCustomFood, removeFood, showToast } = useApp();

  // Form local state variables
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage'>('breakfast');
  const [region, setRegion] = useState<'rwanda' | 'global'>('rwanda');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [serving, setServing] = useState('');

  // Sandbox admin stats constants
  const baseUsersCount = 184;
  const activeSubsCount = 47;
  const baseGrossSales = 295000;
  
  const ordersVolume = orders.reduce((sum, o) => sum + o.price, 0);
  const totalGross = baseGrossSales + ordersVolume;
  const calculatedCommissions = Math.round(totalGross * 0.12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const calVal = parseInt(calories);
    const pVal = parseInt(protein);
    const cVal = parseInt(carbs);
    const fVal = parseInt(fat);

    if (!name || isNaN(calVal) || isNaN(pVal) || isNaN(cVal) || isNaN(fVal) || !serving) {
      showToast("Please fill all inputs correctly.", "danger");
      return;
    }

    addCustomFood({
      name,
      category,
      region,
      calories: calVal,
      protein: pVal,
      carbs: cVal,
      fat: fVal,
      serving,
      desc: "Custom food item added through the Administration Console."
    });

    // Reset fields
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setServing('');
  };

  return (
    <section id="adminView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Administration Platform</h1>
          <p>Manage system food definitions, monitor client subscription billing, and view commissions.</p>
        </div>
      </div>
      
      <div className="admin-metrics-grid">
        <div className="card stat-box">
          <h5>TOTAL USERS</h5>
          <p id="admin_total_users">{baseUsersCount}</p>
        </div>
        <div className="card stat-box">
          <h5>PREMIUM SUBS</h5>
          <p id="admin_subscribers">{activeSubsCount}</p>
        </div>
        <div className="card stat-box">
          <h5>EST. COMMISSIONS (12%)</h5>
          <p style={{ color: 'var(--color-primary)' }}>{calculatedCommissions.toLocaleString()} RWF</p>
        </div>
        <div className="card stat-box">
          <h5>GROSS VOLUME</h5>
          <p style={{ color: 'var(--color-info)' }}>{totalGross.toLocaleString()} RWF</p>
        </div>
      </div>
      
      <div className="admin-layout-grid">
        {/* Left: Food Table list */}
        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 className="card-title">System Food Database</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Food Name</th>
                <th>Region</th>
                <th>Category</th>
                <th>Calories</th>
                <th>P/C/F Split</th>
                <th>Serving</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {foodDatabase.map((food, idx) => (
                <tr key={food.id || idx}>
                  <td><strong>{food.name}</strong></td>
                  <td>
                    <span className={`food-category-pill ${food.region}`}>
                      {food.region}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{food.category}</td>
                  <td><strong>{food.calories}</strong></td>
                  <td>{food.protein}g / {food.carbs}g / {food.fat}g</td>
                  <td>{food.serving}</td>
                  <td>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '0.25rem 0.5rem' }} 
                      onClick={() => removeFood(food.id)}
                    >
                      <i className="fas fa-trash-alt" style={{ color: 'var(--color-danger)' }}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Right: Create Food Form */}
        <div className="card">
          <h3 className="card-title">Create Food Item</h3>
          <form id="adminFoodForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin_food_name">Food Name</label>
              <input 
                type="text" 
                id="admin_food_name" 
                className="form-input" 
                placeholder="e.g. Brochettes de poisson" 
                value={name}
                onChange={e => setName(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_category">Meal Type</label>
                <select 
                  id="admin_food_category" 
                  className="form-input" 
                  style={{ background: '#111827' }}
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="beverage">Beverage</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_region">Region</label>
                <select 
                  id="admin_food_region" 
                  className="form-input" 
                  style={{ background: '#111827' }}
                  value={region}
                  onChange={e => setRegion(e.target.value as any)}
                >
                  <option value="rwanda">Rwanda (Local)</option>
                  <option value="global">Global (Western)</option>
                </select>
              </div>
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_calories">Calories (kcal)</label>
                <input 
                  type="number" 
                  id="admin_food_calories" 
                  className="form-input" 
                  value={calories}
                  onChange={e => setCalories(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_serving">Serving Size</label>
                <input 
                  type="text" 
                  id="admin_food_serving" 
                  className="form-input" 
                  placeholder="e.g. 150g" 
                  value={serving}
                  onChange={e => setServing(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_protein">Protein (g)</label>
                <input 
                  type="number" 
                  id="admin_food_protein" 
                  className="form-input" 
                  value={protein}
                  onChange={e => setProtein(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_carbs">Carbs (g)</label>
                <input 
                  type="number" 
                  id="admin_food_carbs" 
                  className="form-input" 
                  value={carbs}
                  onChange={e => setCarbs(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin_food_fat">Fat (g)</label>
                <input 
                  type="number" 
                  id="admin_food_fat" 
                  className="form-input" 
                  value={fat}
                  onChange={e => setFat(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Add to Database <i className="fas fa-plus"></i>
            </button>
          </form>
        </div>
      </div>
      
      {/* Sandboxed Delivery Orders Log */}
      <div className="card" style={{ marginTop: '2rem', overflowX: 'auto' }}>
        <h3 className="card-title">Sandboxed Restaurant Delivery Order Log</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Restaurant</th>
              <th>Item Ordered</th>
              <th>Price</th>
              <th>Commissions (12%)</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No orders logged in system sandbox yet.
                </td>
              </tr>
            ) : (
              orders.map(o => {
                const commission = Math.round(o.price * 0.12);
                return (
                  <tr key={o.id}>
                    <td><strong>{o.id}</strong></td>
                    <td>{o.restaurantName}</td>
                    <td>{o.foodName}</td>
                    <td>{o.price} RWF</td>
                    <td><span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>+{commission} RWF</span></td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>
                        {o.status === 'delivered' ? 'Delivered' : `${o.status}...`}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default AdminConsole;
