import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

declare global {
  interface Window {
    L: any; // Leaflet global namespace loaded from CDN
  }
}

export const StravaTracker: React.FC = () => {
  const { activities, addStravaActivity } = useApp();
  const [activityType, setActivityType] = useState<'run' | 'ride'>('run');
  const [distance, setDistance] = useState('5.0');
  const [duration, setDuration] = useState('30');
  
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  // Preloaded path coordinates in Kigali for map plotting
  const KIGALI_ROUTES = {
    run: [
      [-1.9442, 30.0898] as [number, number], // Kigali Heights
      [-1.9472, 30.0832] as [number, number], // Rugando
      [-1.9515, 30.0880] as [number, number], // Cadran
      [-1.9485, 30.0924] as [number, number], // Kimihurura
      [-1.9442, 30.0898] as [number, number]  // Return loop
    ],
    ride: [
      [-1.9442, 30.0898] as [number, number], // Kigali Heights
      [-1.9400, 30.0950] as [number, number], // Kacyiru
      [-1.9430, 30.1050] as [number, number], // Parliament area
      [-1.9540, 30.1020] as [number, number], // Remera approach
      [-1.9485, 30.0924] as [number, number], // Kimihurura
      [-1.9442, 30.0898] as [number, number]  // Return Heights
    ]
  };

  // Initialize Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Destroy existing instance if active
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Set map center at Kigali Heights
    const map = window.L.map(mapContainerRef.current, {
      center: [-1.9442, 30.0898],
      zoom: 14,
      zoomControl: true
    });

    mapInstanceRef.current = map;

    // Load OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Initial polyline draw
    const activeCoords = activityType === 'run' ? KIGALI_ROUTES.run : KIGALI_ROUTES.ride;
    const polyline = window.L.polyline(activeCoords, {
      color: activityType === 'run' ? '#10b981' : '#8b5cf6',
      weight: 5,
      opacity: 0.8
    }).addTo(map);

    polylineRef.current = polyline;

    // Set markers at start and end
    window.L.marker(activeCoords[0], {
      icon: window.L.divIcon({
        className: 'custom-map-pin start',
        html: '<div style="background:#10b981; width:12px; height:12px; border-radius:50%; border:2px solid white; box-shadow:0 0 6px rgba(0,0,0,0.5);"></div>'
      })
    }).addTo(map);

    // Fit bounds
    map.fitBounds(polyline.getBounds());

  }, [activityType]);

  const handleSyncWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    const distVal = parseFloat(distance);
    const durVal = parseInt(duration);

    if (isNaN(distVal) || isNaN(durVal)) {
      alert("Please enter valid metrics.");
      return;
    }

    const routeName = activityType === 'run' 
      ? `Kimihurura Valley ${distVal}km Run`
      : `Kigali Heights ${distVal}km Biking Route`;

    const chosenPath = activityType === 'run' ? KIGALI_ROUTES.run : KIGALI_ROUTES.ride;

    addStravaActivity(activityType, routeName, distVal, durVal, chosenPath);
    
    // Animate map panning and success indicators
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([-1.9442, 30.0898]);
    }
  };

  return (
    <section id="stravaView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Ecosystem Activity Tracker</h1>
          <p>Draw bike and running routes around Kigali. Sync active TDEE calorie burns to your daily targets (Strava Integration).</p>
        </div>
      </div>

      <div className="responsive-grid-split" style={{ gridTemplateColumns: '1.6fr 1fr', marginBottom: '2rem' }}>
        
        {/* Left: Real Leaflet Map */}
        <div className="card" style={{ padding: 0, position: 'relative', height: '450px', overflow: 'hidden' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#111827' }}></div>
          
          {/* Map Overlay stats */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '15px',
            background: 'rgba(9, 13, 22, 0.85)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            zIndex: 1000,
            pointerEvents: 'none',
            display: 'flex',
            gap: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>GPS SIGNAL</span>
              <p style={{ fontWeight: 700, color: 'var(--color-primary)' }}><i className="fas fa-satellite-dish"></i> ACTIVE</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DIFFICULTY</span>
              <p style={{ fontWeight: 700, color: 'white' }}>MODERATE HILLS</p>
            </div>
          </div>
        </div>

        {/* Right: Sync Forms */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>
              <i className="fas fa-clock" style={{ color: 'var(--color-secondary)' }}></i> Log Workout Activity
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Completing runs/rides recalculates your daily energy target to fuel recovery.
            </p>

            <form onSubmit={handleSyncWorkout} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Activity Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', 
                    padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' 
                  }}>
                    <input 
                      type="radio" 
                      name="strava_type" 
                      value="run" 
                      checked={activityType === 'run'}
                      onChange={() => setActivityType('run')}
                    /> <i className="fas fa-person-running" style={{ color: 'var(--color-primary)' }}></i> Run
                  </label>
                  <label style={{ 
                    flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', 
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--surface-border)', 
                    padding: '0.85rem', borderRadius: 'var(--radius-md)', cursor: 'pointer' 
                  }}>
                    <input 
                      type="radio" 
                      name="strava_type" 
                      value="ride" 
                      checked={activityType === 'ride'}
                      onChange={() => setActivityType('ride')}
                    /> <i className="fas fa-motorcycle" style={{ color: 'var(--color-secondary)' }}></i> Cycling
                  </label>
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Distance (km)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="form-input" 
                    value={distance}
                    onChange={e => setDistance(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Duration (minutes)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Sync Strava Metrics <i className="fas fa-arrows-spin"></i>
              </button>
            </form>
          </div>

          <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.25rem', marginTop: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Calorie Burn Formulas:
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              • Running: <strong>60 kcal</strong> per km <br />
              • Biking: <strong>35 kcal</strong> per km
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activities Log */}
      <div className="card">
        <h3 className="card-title">Recent Synced Workouts</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
          {activities.map(act => (
            <div key={act.id} className="substitute-item-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: act.type === 'run' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: act.type === 'run' ? 'var(--color-primary)' : 'var(--color-secondary)'
                }}>
                  <i className={`fas ${act.type === 'run' ? 'fa-person-running' : 'fa-bicycle'}`}></i>
                </div>
                <div>
                  <h5 style={{ fontWeight: 700 }}>{act.name}</h5>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {act.distanceKm} km | {act.durationMins} mins | {act.date}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  fontWeight: 700, 
                  color: act.type === 'run' ? 'var(--color-primary)' : 'var(--color-secondary)' 
                }}>
                  +{act.caloriesBurned} kcal
                </span>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Calorie Allowance Adjusted</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StravaTracker;
