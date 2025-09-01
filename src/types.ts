/**
 * Domain types shared across modules.
 */
export type Stage = 'egg' | 'baby' | 'teen' | 'adult';
export type Mood = 'happy' | 'neutral' | 'sad' | 'sick';

export interface Config {
  hungerRatePerHour: number;
  happinessDecayPerHour: number;
  healthDecayPerHour: number;
  randomEventHourlyChance: number;
  notifications: boolean;
}

export interface Inventory {
  food: number;
  toys: number;
  meds: number;
}

export type Achievement =
  | 'WEEK_SURVIVOR'
  | 'MONTH_KEEPER'
  | 'PERFECT_DIET_5'
  | 'PEAK_HAPPY'
  | 'GROWN_UP';

export interface PetState {
  id: string;
  name: string;
  stage: Stage;
  hunger: number; // 0 good..100 bad
  happiness: number; // 0 bad..100 good
  health: number; // 0 dead..100 healthy
  inventory: Partial<Inventory>;
  ageDays: number;
  lastUpdate: string;
  alive: boolean;
  sick: boolean;
  perfectDietStreak: number;
  achievements: Achievement[];
}

export interface RootState {
  currentPetId: string | null;
  pets: Record<string, PetState>;
  config: Config;
  log: string[];
}
