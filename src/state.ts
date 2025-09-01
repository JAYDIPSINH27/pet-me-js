/**
 * State constructors and helpers (bootstrap, load/save, selection).
 */
import { read, write } from './storage';
import { nowISO, shortId } from './utils';
import type { RootState, PetState, Config } from './types';

/** Default config applied on first run. */
export const DEFAULT_CONFIG: Config = {
  hungerRatePerHour: 5,
  happinessDecayPerHour: 3,
  healthDecayPerHour: 2,
  randomEventHourlyChance: 0.2,
  notifications: false,
};

/** Construct a new pet with starter inventory. */
export function makePet(name = 'Pixel'): PetState {
  return {
    id: shortId(),
    name,
    stage: 'egg',
    hunger: 40,
    happiness: 70,
    health: 100,
    inventory: { food: 1, toys: 1, meds: 0 },
    ageDays: 0,
    lastUpdate: nowISO(),
    alive: true,
    sick: false,
    perfectDietStreak: 0,
    achievements: [],
  };
}

/** First-run root state. */
export function makeRoot(): RootState {
  const p = makePet();
  return {
    currentPetId: p.id,
    pets: { [p.id]: p },
    config: DEFAULT_CONFIG,
    log: [`${nowISO()} Hatched pet ${p.name} (${p.id})`],
  };
}

/** Load root (or bootstrap if missing). */
export function loadAll(): RootState {
  return read<RootState>() ?? makeRoot();
}

/** Persist root state. */
export function saveAll(all: RootState): void {
  write(all);
}

/** Get currently selected pet (fallback to first; ensures consistency). */
export function getCurrent(all: RootState): PetState {
  const p = all.currentPetId ? all.pets[all.currentPetId] : undefined;
  if (p) return p;
  const first = Object.values(all.pets)[0];
  if (first) {
    all.currentPetId = first.id;
    return first;
  }
  // guard
  const newPet = makePet();
  all.pets[newPet.id] = newPet;
  all.currentPetId = newPet.id;
  return newPet;
}
