import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  UserProfile, 
  DailyTargets, 
  IntakeLog, 
  FoodItem, 
  Restaurant, 
  OrderItem, 
  MealItem, 
  RecoveryState 
} from '../types';

// ==========================================
// 1. INITIAL STATIC PRELOADED DATA
// ==========================================
const INITIAL_FOOD_DATABASE: FoodItem[] = [
  // --- Rwandan Local Foods ---
  { id: 'rw_isombe', name: 'Isombe (Cassava Leaves Stew)', category: 'lunch', region: 'rwanda', calories: 150, protein: 6, carbs: 12, fat: 9, serving: '150g', desc: 'Cassava leaves pounded and simmered with onions, eggplant, and peanut paste.' },
  { id: 'rw_ugali', name: 'Ugali (Maize Flour Paste)', category: 'lunch', region: 'rwanda', calories: 220, protein: 4, carbs: 48, fat: 1, serving: '150g', desc: 'Starchy staple cooked by mixing maize flour with boiling water.' },
  { id: 'rw_matooke', name: 'Steamed Matooke (Green Bananas)', category: 'dinner', region: 'rwanda', calories: 180, protein: 2, carbs: 42, fat: 0.5, serving: '200g', desc: 'Steamed and lightly mashed green plantains.' },
  { id: 'rw_brochettes_goat', name: 'Goat Brochette (Skewer)', category: 'dinner', region: 'rwanda', calories: 250, protein: 24, carbs: 1, fat: 16, serving: '1 skewer (120g)', desc: 'Tender chunks of grilled goat meat spiced with local piri-piri.' },
  { id: 'rw_brochettes_beef', name: 'Beef Brochette (Skewer)', category: 'dinner', region: 'rwanda', calories: 230, protein: 26, carbs: 1, fat: 13, serving: '1 skewer (120g)', desc: 'Local charcoal-grilled spiced beef skewer.' },
  { id: 'rw_tilapia', name: 'Grilled Tilapia Fish', category: 'dinner', region: 'rwanda', calories: 210, protein: 26, carbs: 0, fat: 11, serving: '150g fillet', desc: 'Whole or filleted tilapia seasoned with garlic and local herbs, grilled over open flames.' },
  { id: 'rw_beans', name: 'Ibihyimbo (Stewed Red Beans)', category: 'lunch', region: 'rwanda', calories: 190, protein: 11, carbs: 32, fat: 1.5, serving: '150g', desc: 'Rwandan-style slow boiled red kidney beans cooked with tomato, onion and salt.' },
  { id: 'rw_avocado', name: 'Local Avocado', category: 'snack', region: 'rwanda', calories: 160, protein: 2, carbs: 8, fat: 15, serving: '0.5 medium avocado', desc: 'Fresh local creamy butter avocado.' },
  { id: 'rw_sweet_potato', name: 'Steamed Sweet Potatoes', category: 'lunch', region: 'rwanda', calories: 170, protein: 2, carbs: 39, fat: 0.2, serving: '180g', desc: 'Slow-cooked local purple/yellow sweet potato.' },
  { id: 'rw_cassava', name: 'Steamed Cassava (Imyumbati)', category: 'lunch', region: 'rwanda', calories: 210, protein: 1.5, carbs: 48, fat: 0.3, serving: '120g', desc: 'Boiled root vegetable staple.' },
  { id: 'rw_passion_fruit', name: 'Fresh Passion Fruit Juice', category: 'beverage', region: 'rwanda', calories: 95, protein: 1, carbs: 22, fat: 0.1, serving: '250ml', desc: 'Squeezed passion fruit diluted with water, lightly sweetened.' },
  { id: 'rw_tree_tomato', name: 'Ikinyomoro (Tree Tomato) Smoothie', category: 'beverage', region: 'rwanda', calories: 110, protein: 2, carbs: 24, fat: 0.8, serving: '250ml', desc: 'Tart and rich local tree tomato fruit blended with water and honey.' },
  { id: 'rw_sorghum_porridge', name: 'Umusururu (Sorghum Porridge)', category: 'breakfast', region: 'rwanda', calories: 190, protein: 5, carbs: 41, fat: 2, serving: '250g', desc: 'Warm traditional beverage made of fermented sorghum flour.' },
  
  // --- Global/Western Foods ---
  { id: 'gl_oatmeal', name: 'Oatmeal with Honey', category: 'breakfast', region: 'global', calories: 240, protein: 8, carbs: 42, fat: 4, serving: '200g cooked', desc: 'Rolled oats boiled in water, topped with a teaspoon of wild honey.' },
  { id: 'gl_eggs', name: 'Scrambled Whole Eggs', category: 'breakfast', region: 'global', calories: 210, protein: 18, carbs: 1.5, fat: 15, serving: '3 large eggs', desc: 'Fresh farm eggs whisked and scrambled in a light pan spray.' },
  { id: 'gl_chicken', name: 'Pan-Seared Chicken Breast', category: 'lunch', region: 'global', calories: 185, protein: 35, carbs: 0, fat: 4.5, serving: '150g', desc: 'Skinless lean chicken breast grilled with salt, black pepper, and herbs.' },
  { id: 'gl_rice', name: 'Steamed Jasmine Rice', category: 'lunch', region: 'global', calories: 200, protein: 4, carbs: 44, fat: 0.3, serving: '150g cooked', desc: 'Fragrant long-grain white rice steamed fluffy.' },
  { id: 'gl_salmon', name: 'Baked Atlantic Salmon', category: 'dinner', region: 'global', calories: 280, protein: 30, carbs: 0, fat: 17, serving: '150g', desc: 'Rich in omega-3, baked fillet with lemon wedges.' },
  { id: 'gl_broccoli', name: 'Steamed Broccoli Florets', category: 'dinner', region: 'global', calories: 45, protein: 3, carbs: 8, fat: 0.5, serving: '150g', desc: 'Fresh green broccoli steamed tender-crisp.' },
  { id: 'gl_whey_shake', name: 'Whey Protein Shake', category: 'snack', region: 'global', calories: 140, protein: 25, carbs: 3, fat: 1.5, serving: '1 scoop (35g)', desc: 'High-purity whey isolate mixed in cold water.' },
  { id: 'gl_almonds', name: 'Raw Almonds', category: 'snack', region: 'global', calories: 160, protein: 6, carbs: 6, fat: 14, serving: '30g (approx 23 nuts)', desc: 'Whole unsalted crunchy raw almonds.' },
  { id: 'gl_green_tea', name: 'Antioxidant Green Tea', category: 'beverage', region: 'global', calories: 2, protein: 0, carbs: 0.2, fat: 0, serving: '300ml', desc: 'Fresh brewed loose organic green tea leaves.' },
  { id: 'gl_greek_yogurt', name: 'Greek Yogurt (Plain)', category: 'breakfast', region: 'global', calories: 130, protein: 15, carbs: 6, fat: 3, serving: '150g', desc: 'Thick strained probiotic plain Greek yogurt.' }
];

const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest_meze_fresh',
    name: 'Meze Fresh (Kigali)',
    cuisine: 'Mexican & Fresh Grill',
    location: 'Kimihurura, Kigali',
    rating: 4.7,
    avgDeliveryTime: 25,
    commissionRate: 0.12,
    menu: [
      { id: 'meze_chicken_burrito_bowl', name: 'Lean Chicken Burrito Bowl', calories: 580, protein: 42, carbs: 65, fat: 14, price: 6500, desc: 'Grilled chicken, brown rice, black beans, pico de gallo, fresh lettuce, and half portion guacamole.' },
      { id: 'meze_steak_tacos', name: 'Steak Corn Tortilla Tacos', calories: 460, protein: 35, carbs: 38, fat: 12, price: 5800, desc: 'Three soft corn tortillas loaded with grilled steak strips, chopped coriander, and onions.' },
      { id: 'meze_vegan_bowl', name: 'Guacamole & Bean Protein Bowl', calories: 420, protein: 14, carbs: 58, fat: 18, price: 5000, desc: 'Fresh pinto beans, brown rice, sweet corn salsa, double avocado guacamole, and cilantro lime dressing.' }
    ]
  },
  {
    id: 'rest_java_house',
    name: 'Java House (Kigali Heights)',
    cuisine: 'Café & Fusion',
    location: 'Kacyiru / KBC, Kigali',
    rating: 4.5,
    avgDeliveryTime: 35,
    commissionRate: 0.10,
    menu: [
      { id: 'java_cobb_salad', name: 'High-Protein Cobb Salad', calories: 520, protein: 38, carbs: 12, fat: 34, price: 8500, desc: 'Mixed salad leaves, hard-boiled egg, chicken strips, tomato cubes, sliced avocado with a olive oil dressing.' },
      { id: 'java_tilapia_ugali', name: 'Grilled Tilapia with Mixed Greens & Ugali', calories: 650, protein: 45, carbs: 68, fat: 15, price: 9500, desc: 'Whole grilled river fish served with a side of local Ugali and steamed spinach.' },
      { id: 'java_fruit_smoothie', name: 'Energizer Tree Tomato & Mango Smoothie', calories: 230, protein: 4, carbs: 52, fat: 1, price: 4200, desc: 'Blended fresh local tree tomato pulp, ripe sweet mango, and a splash of plain fat-free yogurt.' }
    ]
  },
  {
    id: 'rest_shokola',
    name: 'Shokola (Kimihurura)',
    cuisine: 'Mediterranean & Local Fusion',
    location: 'Kimihurura, Kigali',
    rating: 4.8,
    avgDeliveryTime: 30,
    commissionRate: 0.15,
    menu: [
      { id: 'shokola_isombe_fish', name: 'Kigali Health Platter (Isombe & Tilapia Fillet)', calories: 410, protein: 32, carbs: 18, fat: 12, price: 8000, desc: 'Authentic local Isombe cassava leaves cooked with peanut essence, accompanied by pan-grilled tilapia fillet.' },
      { id: 'shokola_beef_brochettes', name: 'Brochette Duo with Roasted Potatoes & Salad', calories: 590, protein: 38, carbs: 48, fat: 22, price: 7500, desc: 'Two skewers of prime beef grilled over lava stones, served with baby roasted potatoes and garden salad.' },
      { id: 'shokola_hibiscus_tea', name: 'Iced Hibiscus Infusion (Roselle)', calories: 35, protein: 0, carbs: 8, fat: 0, price: 2500, desc: 'Antioxidant-rich home-brewed hibiscus flower infusion, organic local honey sweetened.' }
    ]
  }
];

// ==========================================
// 2. CONTEXT DECLARATIONS & INTERFACES
// ==========================================
export interface ToastMsg {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'danger';
}

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  targets: DailyTargets;
  intake: IntakeLog;
  meals: MealItem[];
  recovery: RecoveryState;
  orders: OrderItem[];
  foodDatabase: FoodItem[];
  restaurants: Restaurant[];
  toasts: ToastMsg[];
  
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logMealState: (mealId: string, status: MealItem['status']) => void;
  substituteMeal: (mealId: string, foodId: string) => void;
  addWater: (amountMl: number) => void;
  placeOrder: (restaurantId: string, menuItemId: string, mealIdToReplace: string | null) => void;
  addCustomFood: (food: Omit<FoodItem, 'id'>) => void;
  removeFood: (foodId: string) => void;
  resetRecovery: () => void;
  quickLoadPreset: (type: 'loss_kigali' | 'athlete_global') => void;
  showToast: (msg: string, type?: ToastMsg['type']) => void;
  removeToast: (id: string) => void;
  finishOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State variables
  const [activeTab, setActiveTab] = useState<string>('setup');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>(INITIAL_FOOD_DATABASE);
  const [restaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [recovery, setRecovery] = useState<RecoveryState>({
    active: false,
    message: '',
    adjustmentMade: false,
    skippedMealId: null
  });

  const [user, setUser] = useState<UserProfile>({
    weight: 75,
    height: 175,
    age: 28,
    gender: 'male',
    activity: 'moderate',
    goal: 'loss',
    dietPreference: 'anything',
    region: 'rwanda',
    city: 'Kigali',
    allergies: [],
    mealSchedule: {
      breakfast: '08:00',
      lunch: '13:00',
      dinner: '19:30',
      snack: '16:00',
      beverage: '11:00'
    },
    hasSubscription: false,
    onboarded: false
  });

  const [targets, setTargets] = useState<DailyTargets>({
    calories: 2000,
    protein: 120,
    carbs: 220,
    fat: 65,
    water: 2500
  });

  const [intake, setIntake] = useState<IntakeLog>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
    streak: 5
  });

  // Schedule template
  const [meals, setMeals] = useState<MealItem[]>([
    { id: 'breakfast', name: 'Breakfast', time: '08:00', type: 'breakfast', status: 'pending', food: {} as FoodItem },
    { id: 'beverage_mid', name: 'Mid-Morning Hydration', time: '11:00', type: 'beverage', status: 'pending', food: {} as FoodItem },
    { id: 'lunch', name: 'Lunch', time: '13:00', type: 'lunch', status: 'pending', food: {} as FoodItem },
    { id: 'snack_afternoon', name: 'Afternoon Fuel', time: '16:00', type: 'snack', status: 'pending', food: {} as FoodItem },
    { id: 'dinner', name: 'Dinner', time: '19:30', type: 'dinner', status: 'pending', food: {} as FoodItem }
  ]);

  // Toast notifications helpers
  const showToast = (message: string, type: ToastMsg['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto-fadeout
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Mifflin-St Jeor Formula
  const calculateBMR = (w: number, h: number, a: number, g: string) => {
    let bmr = 10 * w + 6.25 * h - 5 * a;
    if (g === 'male') return Math.round(bmr + 5);
    if (g === 'female') return Math.round(bmr - 161);
    return Math.round(bmr - 78); // Average gender neutral
  };

  const calculateTDEE = (bmr: number, activity: string) => {
    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very: 1.725,
      extra: 1.9
    };
    return Math.round(bmr * (multipliers[activity] || 1.2));
  };

  // Recalculates Target Macros & updates Meal Generation Planner
  const recalculateMacrosAndPlans = (customUser = user, currentFoods = foodDatabase) => {
    const bmr = calculateBMR(customUser.weight, customUser.height, customUser.age, customUser.gender);
    const tdee = calculateTDEE(bmr, customUser.activity);
    
    let kcal = tdee;
    if (customUser.goal === 'loss') {
      kcal = Math.max(tdee - 500, 1200); // 1200 kcal floor safety
    } else if (customUser.goal === 'gain') {
      kcal = tdee + 400;
    }
    kcal = Math.round(kcal);

    let pRatio = 0.20, cRatio = 0.50, fRatio = 0.30;
    if (customUser.goal === 'loss') {
      pRatio = 0.30; fRatio = 0.25; cRatio = 0.45;
    } else if (customUser.goal === 'gain') {
      pRatio = 0.25; fRatio = 0.25; cRatio = 0.50;
    }

    const p = Math.round((kcal * pRatio) / 4);
    const c = Math.round((kcal * cRatio) / 4);
    const f = Math.round((kcal * fRatio) / 9);
    const w = Math.round(customUser.weight * 35); // 35ml per kg bodyweight

    const nextTargets = { calories: kcal, protein: p, carbs: c, fat: f, water: w };
    setTargets(nextTargets);
    
    // Distribute among food schedule
    const ratios: Record<string, number> = {
      breakfast: 0.25,
      lunch: 0.35,
      snack_afternoon: 0.10,
      dinner: 0.30,
      beverage_mid: 0
    };

    setMeals(prevMeals => 
      prevMeals.map(m => {
        // If the meal is already eaten/skipped, don't re-plan it!
        if (m.status === 'eaten' || m.status === 'skipped') return m;
        
        const ratio = ratios[m.id] || 0;
        const slotCal = Math.round(kcal * ratio);
        
        const candidates = currentFoods.filter(food => 
          food.category === m.type && food.region === customUser.region
        );
        
        if (candidates.length > 0) {
          // Sort candidates by closeness to calorie targets
          let bestFood = candidates[0];
          let smallestDiff = Infinity;
          
          candidates.forEach(f => {
            const diff = Math.abs(f.calories - slotCal);
            if (diff < smallestDiff) {
              smallestDiff = diff;
              bestFood = f;
            }
          });
          
          const multiplier = slotCal > 0 ? (slotCal / bestFood.calories) : 1;
          const adjustedPortion = Math.round(parseFloat(bestFood.serving) * multiplier);
          
          return {
            ...m,
            food: {
              id: bestFood.id,
              name: bestFood.name,
              category: bestFood.category,
              region: bestFood.region,
              calories: slotCal,
              protein: Math.round(bestFood.protein * multiplier),
              carbs: Math.round(bestFood.carbs * multiplier),
              fat: Math.round(bestFood.fat * multiplier),
              serving: isNaN(adjustedPortion) ? bestFood.serving : `${adjustedPortion}g`,
              desc: bestFood.desc
            }
          };
        } else {
          // Fallback to global
          const fallbacks = currentFoods.filter(food => food.category === m.type);
          const fallbackFood = fallbacks[0] || { name: 'Health Shake', calories: slotCal, protein: Math.round(p * ratio), carbs: Math.round(c * ratio), fat: Math.round(f * ratio), serving: '1 scoop', desc: 'Balanced nutrition formulation.' };
          return {
            ...m,
            food: fallbackFood as FoodItem
          };
        }
      })
    );
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    const nextUser = { ...user, ...updates };
    setUser(nextUser);
    recalculateMacrosAndPlans(nextUser);
  };

  const logMealState = (mealId: string, status: MealItem['status']) => {
    setMeals(prevMeals => {
      const nextMeals = [...prevMeals];
      const targetIndex = nextMeals.findIndex(m => m.id === mealId);
      if (targetIndex === -1) return prevMeals;
      
      const oldMeal = nextMeals[targetIndex];
      
      // If it was already logged as eaten, deduct nutrients
      if (oldMeal.status === 'eaten') {
        setIntake(prev => ({
          ...prev,
          calories: Math.max(prev.calories - oldMeal.food.calories, 0),
          protein: Math.max(prev.protein - oldMeal.food.protein, 0),
          carbs: Math.max(prev.carbs - oldMeal.food.carbs, 0),
          fat: Math.max(prev.fat - oldMeal.food.fat, 0)
        }));
      }

      const updatedMeal = { ...oldMeal, status };
      nextMeals[targetIndex] = updatedMeal;

      if (status === 'eaten') {
        setIntake(prev => ({
          ...prev,
          calories: prev.calories + updatedMeal.food.calories,
          protein: prev.protein + updatedMeal.food.protein,
          carbs: prev.carbs + updatedMeal.food.carbs,
          fat: prev.fat + updatedMeal.food.fat
        }));
        showToast(`Logged: ${updatedMeal.food.name} (${updatedMeal.food.calories} kcal)`);
      } else if (status === 'skipped') {
        // Redirection system active!
        // Find next remaining pending meals
        const nextPending = nextMeals.slice(targetIndex + 1).filter(m => m.status === 'pending');
        setRecovery({
          active: true,
          skippedMealId: mealId,
          adjustmentMade: nextPending.length > 0,
          message: nextPending.length > 0 
            ? `You skipped ${updatedMeal.name}. NutriMe adjusted your remaining meals by +${Math.round((updatedMeal.food.calories * 0.6) / nextPending.length)} kcal to stay on track.`
            : `You skipped ${updatedMeal.name}. As it's late, avoid heavy foods. Target a light, high-protein snack before bed.`
        });

        if (nextPending.length > 0) {
          const kcalExtra = Math.round((updatedMeal.food.calories * 0.6) / nextPending.length);
          const pExtra = Math.round((updatedMeal.food.protein * 0.6) / nextPending.length);
          const cExtra = Math.round((updatedMeal.food.carbs * 0.6) / nextPending.length);
          const fExtra = Math.round((updatedMeal.food.fat * 0.6) / nextPending.length);
          
          nextPending.forEach(meal => {
            const idx = nextMeals.findIndex(m => m.id === meal.id);
            if (idx !== -1) {
              nextMeals[idx] = {
                ...nextMeals[idx],
                food: {
                  ...nextMeals[idx].food,
                  name: `${nextMeals[idx].food.name} (Macro Adjusted)`,
                  calories: nextMeals[idx].food.calories + kcalExtra,
                  protein: nextMeals[idx].food.protein + pExtra,
                  carbs: nextMeals[idx].food.carbs + cExtra,
                  fat: nextMeals[idx].food.fat + fExtra
                }
              };
            }
          });
          showToast("Adaptive Plan Recalculated!", "warning");
        }
      } else if (status === 'pending' && recovery.skippedMealId === mealId) {
        // Reset recovery if reverted
        setRecovery({ active: false, skippedMealId: null, adjustmentMade: false, message: '' });
        // Trigger macro plans re-distribution to purge changes
        setTimeout(() => recalculateMacrosAndPlans(), 50);
      }

      return nextMeals;
    });
  };

  const substituteMeal = (mealId: string, foodId: string) => {
    const replacement = foodDatabase.find(f => f.id === foodId);
    if (!replacement) return;

    setMeals(prevMeals => 
      prevMeals.map(m => {
        if (m.id !== mealId) return m;
        
        const currentBudget = m.food.calories;
        const multiplier = currentBudget / replacement.calories;
        const portions = Math.round(parseFloat(replacement.serving) * multiplier);

        return {
          ...m,
          food: {
            ...replacement,
            calories: currentBudget,
            protein: Math.round(replacement.protein * multiplier),
            carbs: Math.round(replacement.carbs * multiplier),
            fat: Math.round(replacement.fat * multiplier),
            serving: isNaN(portions) ? replacement.serving : `${portions}g`,
            desc: replacement.desc
          }
        };
      })
    );
    showToast(`Substituted with ${replacement.name}`);
  };

  const addWater = (amountMl: number) => {
    setIntake(prev => ({ ...prev, water: prev.water + amountMl }));
    showToast(`Logged hydration: +${amountMl}ml`, "info");
  };

  const placeOrder = (restaurantId: string, menuItemId: string, mealIdToReplace: string | null) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    const item = restaurant.menu.find(m => m.id === menuItemId);
    if (!item) return;

    const orderId = 'ord_' + Date.now();
    const newOrder: OrderItem = {
      id: orderId,
      restaurantName: restaurant.name,
      foodName: item.name,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      price: item.price,
      status: 'received',
      mealIdToReplace: mealIdToReplace,
      progress: 10
    };

    setOrders(prev => [newOrder, ...prev]);
    showToast("Order placed successfully!", "info");

    // Automatically replace meal slot in dashboard log
    if (mealIdToReplace) {
      setMeals(prevMeals => 
        prevMeals.map(m => {
          if (m.id !== mealIdToReplace) return m;
          
          return {
            ...m,
            status: 'eaten', // Auto logs eaten
            food: {
              id: 'rest_item_' + item.id,
              name: `[Restaurant] ${item.name}`,
              category: m.type,
              region: user.region,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat,
              serving: '1 ordered serving',
              desc: `Ordered fresh from ${restaurant.name}.`
            }
          };
        })
      );
      setIntake(prev => ({
        ...prev,
        calories: prev.calories + item.calories,
        protein: prev.protein + item.protein,
        carbs: prev.carbs + item.carbs,
        fat: prev.fat + item.fat
      }));
    }

    // Run live simulation tracker updates
    let steps: OrderItem['status'][] = ['preparing', 'dispatched', 'delivered'];
    let stepTimes = [4500, 9000, 14000];
    let stepProgress = [40, 75, 100];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setOrders(prevOrders => 
          prevOrders.map(o => {
            if (o.id !== orderId) return o;
            
            // Notification triggers
            if (step === 'preparing') showToast(`Cooking at ${o.restaurantName}...`, "info");
            if (step === 'dispatched') showToast("Driver picked up your meal!", "info");
            if (step === 'delivered') showToast("Meal delivered! Enjoy your fresh nutrition.", "info");

            return {
              ...o,
              status: step,
              progress: stepProgress[idx]
            };
          })
        );
      }, stepTimes[idx]);
    });

    setActiveTab('orders');
  };

  const addCustomFood = (food: Omit<FoodItem, 'id'>) => {
    const newFood: FoodItem = {
      ...food,
      id: 'custom_' + Date.now()
    };
    
    setFoodDatabase(prev => {
      const nextDb = [...prev, newFood];
      recalculateMacrosAndPlans(user, nextDb);
      return nextDb;
    });
    showToast(`Added ${food.name} to food database!`);
  };

  const removeFood = (foodId: string) => {
    setFoodDatabase(prev => {
      const nextDb = prev.filter(f => f.id !== foodId);
      recalculateMacrosAndPlans(user, nextDb);
      return nextDb;
    });
    showToast("Food removed from database", "info");
  };

  const resetRecovery = () => {
    setRecovery({ active: false, skippedMealId: null, adjustmentMade: false, message: '' });
    setTimeout(() => recalculateMacrosAndPlans(), 50);
  };

  const quickLoadPreset = (type: 'loss_kigali' | 'athlete_global') => {
    const profiles = {
      loss_kigali: {
        weight: 82,
        height: 168,
        age: 26,
        gender: 'female' as const,
        activity: 'light' as const,
        goal: 'loss' as const,
        region: 'rwanda' as const,
        city: 'Kigali',
        dietPreference: 'anything',
        allergies: [],
        mealSchedule: user.mealSchedule,
        hasSubscription: true,
        onboarded: false
      },
      athlete_global: {
        weight: 78,
        height: 182,
        age: 29,
        gender: 'male' as const,
        activity: 'very' as const,
        goal: 'gain' as const,
        region: 'global' as const,
        city: 'London',
        dietPreference: 'anything',
        allergies: [],
        mealSchedule: user.mealSchedule,
        hasSubscription: false,
        onboarded: false
      }
    };
    
    const p = profiles[type];
    if (p) {
      setUser(p);
      recalculateMacrosAndPlans(p);
      showToast("Preset Loaded! Click 'Confirm' to build plan.", "info");
    }
  };

  const finishOnboarding = () => {
    setUser(prev => ({ ...prev, onboarded: true }));
    setActiveTab('home');
    showToast("Profile set up! Personalized meal plan calculated.");
  };

  // Run initial calculation review load
  useEffect(() => {
    recalculateMacrosAndPlans();
  }, []);

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      user,
      targets,
      intake,
      meals,
      recovery,
      orders,
      foodDatabase,
      restaurants,
      toasts,
      updateUserProfile,
      logMealState,
      substituteMeal,
      addWater,
      placeOrder,
      addCustomFood,
      removeFood,
      resetRecovery,
      quickLoadPreset,
      showToast,
      removeToast,
      finishOnboarding
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
