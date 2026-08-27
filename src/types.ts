// TypeScript Type Definitions for NutriMe

export interface UserProfile {
  weight: number;      // in kg
  height: number;      // in cm
  age: number;         // in years
  gender: 'male' | 'female' | 'other';
  activity: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'loss' | 'maintenance' | 'gain';
  dietPreference: string;
  region: 'rwanda' | 'global';
  city: string;
  allergies: string[];
  mealSchedule: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    beverage: string;
  };
  subscriptionTier: 'free' | 'premium' | 'ultimate'; // free, 2000 RWF (premium), 5000 RWF (ultimate)
  onboarded: boolean;
}

export interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  name: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface StravaActivity {
  id: string;
  type: 'run' | 'ride';
  name: string;
  distanceKm: number;
  durationMins: number;
  caloriesBurned: number;
  date: string;
  path: [number, number][]; // coordinates for Leaflet lines
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  burnedCalories: number; // dynamically added from Strava running/biking
}

export interface IntakeLog {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  streak: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'beverage';
  region: 'rwanda' | 'global';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  desc: string;
}

export interface MenuItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  desc: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  avgDeliveryTime: number;
  commissionRate: number;
  menu: MenuItem[];
}

export interface OrderItem {
  id: string;
  restaurantName: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  status: 'received' | 'preparing' | 'dispatched' | 'delivered';
  mealIdToReplace: string | null;
  progress: number;
}

export interface MealItem {
  id: 'breakfast' | 'beverage_mid' | 'lunch' | 'snack_afternoon' | 'dinner';
  name: string;
  time: string;
  type: 'breakfast' | 'beverage' | 'lunch' | 'snack' | 'dinner';
  status: 'pending' | 'eaten' | 'skipped' | 'replaced';
  food: FoodItem;
}

export interface RecoveryState {
  active: boolean;
  message: string;
  adjustmentMade: boolean;
  skippedMealId: string | null;
}
