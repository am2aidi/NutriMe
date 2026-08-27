import React from 'react';
import { useApp } from '../context/AppContext';

export const GymHub: React.FC = () => {
  const { user } = useApp();

  const getWorkoutPlan = () => {
    if (user.goal === 'loss') {
      return {
        title: "HIIT & Fat Loss Cardio Plan",
        subtitle: "Max energy expenditure while preserving muscle volume.",
        split: [
          { day: "Day 1", workout: "Full Body Strength Circuit (3x12 reps) + 15 min Stairmaster" },
          { day: "Day 2", workout: "High-Intensity Interval Run (30 sec sprint, 60 sec walk, 12 rounds)" },
          { day: "Day 3", workout: "Active Recovery (Mobility work + Light walking)" },
          { day: "Day 4", workout: "Lower Body Focus & Core (Squats, Lunges, Planks)" },
          { day: "Day 5", workout: "Upper Body Push & Pull + 20 min LISS Cardio" },
          { day: "Day 6", workout: "Weekend Hikes or Cycling (60 mins)" },
          { day: "Day 7", workout: "Full Rest & Stretching" }
        ],
        advice: "Keep rest periods brief (45-60 seconds) to sustain elevated heart rate. Prioritize high-protein foods to preserve lean mass during deficit."
      };
    } else if (user.goal === 'gain') {
      return {
        title: "Hypertrophy & Muscle Volume Plan",
        subtitle: "Focus on progressive overload and calorie surplus uptake.",
        split: [
          { day: "Day 1", workout: "Heavy Push Day (Chest, Shoulders, Triceps — 4x8 reps)" },
          { day: "Day 2", workout: "Heavy Pull Day (Back, Biceps, Rear Delts — 4x8 reps)" },
          { day: "Day 3", workout: "Leg Day Hypertrophy (Squats, Leg Press, Calves — 4x10 reps)" },
          { day: "Day 4", workout: "Active Rest (Stretching + Hydration)" },
          { day: "Day 5", workout: "Upper Body Hypertrophy (Focus on isolation movements — 3x12 reps)" },
          { day: "Day 6", workout: "Legs & Core Volume (Deadlifts, Leg curls, Hanging Leg Raises)" },
          { day: "Day 7", workout: "Rest & Muscle Recovery" }
        ],
        advice: "Focus on form and slow eccentric contractions. Rest 90-120 seconds between heavy sets. Consume protein every 3-4 hours."
      };
    } else {
      return {
        title: "Balanced Strength & Conditioning Plan",
        subtitle: "Improve physical baseline and maintain steady weight metrics.",
        split: [
          { day: "Day 1", workout: "Upper Body Strength (5x5 reps compound movements)" },
          { day: "Day 2", workout: "Lower Body Strength (5x5 reps Deadlifts/Squats)" },
          { day: "Day 3", workout: "LISS Cardio (30 mins steady jog or cycle)" },
          { day: "Day 4", workout: "Core Conditioning & Mobility" },
          { day: "Day 5", workout: "Full Body Conditioning Circuit (3x15 reps)" },
          { day: "Day 6", workout: "Active Outing (Hiking, Swimming, Cycling)" },
          { day: "Day 7", workout: "Rest & Yoga" }
        ],
        advice: "Vary intensities. Maintain calories at maintenance limits. Ensure 7-8 hours of sleep for proper central nervous system recovery."
      };
    }
  };

  const plan = getWorkoutPlan();

  return (
    <section id="gymView" className="view-section">
      <div className="content-header">
        <div className="header-title-container">
          <h1>Ecosystem Gym & Health Hub</h1>
          <p>Goal-tailored training programs, hydration protocols, and hypertrophy metrics.</p>
        </div>
      </div>

      <div className="responsive-grid-split">
        
        {/* Left: Custom Workout Splits */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Your Custom Training Blueprint
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', color: 'white', marginTop: '0.2rem' }}>{plan.title}</h3>
            </div>
            <span style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}><i className="fas fa-dumbbell"></i></span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{plan.subtitle}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {plan.split.map((s, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '1rem',
                padding: '0.85rem 1rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                alignItems: 'center'
              }}>
                <span style={{
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: 'var(--color-primary)',
                  background: 'rgba(16,185,129,0.1)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  minWidth: '55px',
                  textAlign: 'center'
                }}>{s.day}</span>
                <span style={{ fontSize: '0.9rem', color: 'white' }}>{s.workout}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Health Tips and 1RM calculation tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>
              <i className="fas fa-heartpulse" style={{ color: 'var(--color-danger)' }}></i> Nutritional Safety Rules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <p>
                <strong>1. Stay Hydrated:</strong> Drink 35ml of water per kg bodyweight. Increase this by 500ml for every 30 minutes of heavy sweating.
              </p>
              <p>
                <strong>2. Protein Floor:</strong> Target at least 1.6g of protein per kg of body weight daily to sustain muscle structure.
              </p>
              <p>
                <strong>3. Muscle Recovery:</strong> Rest muscle groups 48 hours before retraining. Muscle growth occurs during sleep and rest, not in the gym.
              </p>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(16, 185, 129, 0.02))' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>
              <i className="fas fa-calculator" style={{ color: 'var(--color-secondary)' }}></i> One-Rep Max (1RM) Estimator
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Estimate your lifts using the Brzycki Formula.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" placeholder="Weight (kg)" className="form-input" style={{ flex: 1, padding: '0.5rem' }} id="rm_w" defaultValue={80} />
                <input type="number" placeholder="Reps" className="form-input" style={{ flex: 1, padding: '0.5rem' }} id="rm_r" defaultValue={8} />
              </div>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const w = parseFloat((document.getElementById('rm_w') as HTMLInputElement).value);
                  const r = parseInt((document.getElementById('rm_r') as HTMLInputElement).value);
                  if (w && r) {
                    const max = Math.round(w / (1.0278 - (0.0278 * r)));
                    alert(`Your estimated One-Rep Max is: ${max} kg`);
                  }
                }}
              >
                Estimate Lift Max
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default GymHub;
