import React from 'react';
import { useApp } from '../context/AppContext';

export const Analytics: React.FC = () => {
  const { user, orders } = useApp();

  // Create weight log calculations based on goals
  let weighIns: number[] = [];
  let startWeight = user.goal === 'loss' ? user.weight + 2.2 : user.goal === 'gain' ? user.weight - 1.8 : user.weight;

  for (let i = 0; i < 7; i++) {
    let variance = 0;
    if (user.goal === 'loss') {
      variance = -0.37 * i + (Math.sin(i) * 0.2);
    } else if (user.goal === 'gain') {
      variance = 0.3 * i + (Math.sin(i) * 0.15);
    } else {
      variance = Math.sin(i) * 0.1;
    }
    weighIns.push(parseFloat((startWeight + variance).toFixed(1)));
  }

  // Chart coordinates mapping (ViewBox width 500, height 200)
  const minW = Math.min(...weighIns) - 1;
  const maxW = Math.max(...weighIns) + 1;
  const range = maxW - minW || 1;

  const xSpacing = 450 / 6;
  const points = weighIns.map((w, idx) => {
    const x = 25 + idx * xSpacing;
    const y = 175 - ((w - minW) / range) * 140;
    return { x, y, value: w };
  });

  // Construct SVG path string
  let pathD = '';
  points.forEach((pt, idx) => {
    if (idx === 0) pathD += `M ${pt.x} ${pt.y}`;
    else pathD += ` L ${pt.x} ${pt.y}`;
  });

  const totalDiff = (weighIns[6] - weighIns[0]).toFixed(1);

  return (
    <section id="progressView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Goal Progress Analytics</h1>
          <p>Review weigh-ins, tracking adherence, and ecosystem transaction ledgers.</p>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3 className="card-title">7-Day Weight Log</h3>
          
          <div className="chart-container">
            <svg className="svg-chart" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="25" y1="35" x2="475" y2="35" className="chart-grid-line" />
              <line x1="25" y1="105" x2="475" y2="105" className="chart-grid-line" />
              <line x1="25" y1="175" x2="475" y2="175" className="chart-grid-line" />
              
              {/* Drawn Line Path */}
              {pathD && <path d={pathD} className="chart-line" />}
              
              {/* Plotted Node Points */}
              <g>
                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="6" className="chart-points" />
                    <text 
                      x={pt.x} 
                      y={pt.y - 12} 
                      fill="white" 
                      fontSize="10" 
                      fontWeight="700" 
                      textAnchor="middle"
                    >
                      {pt.value} kg
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
          
          <div className="progress-stats-summary">
            <div className="stat-box">
              <h5>STARTING</h5>
              <p>{weighIns[0]} kg</p>
            </div>
            <div className="stat-box">
              <h5>CURRENT</h5>
              <p>{weighIns[6]} kg</p>
            </div>
            <div className="stat-box">
              <h5>TOTAL CHANGE</h5>
              <p style={{ 
                color: parseFloat(totalDiff) < 0 
                  ? 'var(--color-primary)' 
                  : parseFloat(totalDiff) > 0 
                    ? (user.goal === 'gain' ? 'var(--color-primary)' : 'var(--color-danger)') 
                    : 'white' 
              }}>
                {parseFloat(totalDiff) > 0 ? `+${totalDiff}` : totalDiff} kg
              </p>
            </div>
          </div>
        </div>
        
        {/* Orders ledger list */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title">Order History Ledger</h3>
          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px' }}>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem' }}>
                No orders placed yet.
              </p>
            ) : (
              orders.map(o => (
                <div key={o.id} className="substitute-item-card" style={{ marginBottom: '0.5rem' }}>
                  <div>
                    <h5 style={{ fontWeight: 700 }}>{o.foodName}</h5>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.restaurantName} | {o.calories} kcal</p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'white' }}>{o.price} RWF</span>
                    {o.status === 'delivered' ? (
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-primary)', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '50px', fontWeight: 700 }}>
                        Delivered
                      </span>
                    ) : (
                      <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-accent)', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '50px', fontWeight: 700, textTransform: 'capitalize' }}>
                        {o.status}...
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Analytics;
