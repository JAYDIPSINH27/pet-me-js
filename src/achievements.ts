/**
 * Lightweight achievements.
 */
import type { PetState, Achievement } from './types';

export const labels: Record<Achievement, string> = {
  WEEK_SURVIVOR: '🏆 7-day Survivor',
  MONTH_KEEPER: '🏆 30-day Keeper',
  PERFECT_DIET_5: '🥗 5 Perfect Meals',
  PEAK_HAPPY: '🎉 Peak Happiness',
  GROWN_UP: '🌟 All Grown Up',
};

/** Compute newly-earned achievements for a state. */
export function awardable(state: PetState): Achievement[] {
  const earned = new Set(state.achievements ?? []);
  const adds: Achievement[] = [];

  const days = Math.floor(state.ageDays);
  if (days >= 7 && !earned.has('WEEK_SURVIVOR')) adds.push('WEEK_SURVIVOR');
  if (days >= 30 && !earned.has('MONTH_KEEPER')) adds.push('MONTH_KEEPER');
  if ((state.perfectDietStreak ?? 0) >= 5 && !earned.has('PERFECT_DIET_5')) adds.push('PERFECT_DIET_5');
  if (state.happiness >= 95 && !earned.has('PEAK_HAPPY')) adds.push('PEAK_HAPPY');
  if (state.stage === 'adult' && !earned.has('GROWN_UP')) adds.push('GROWN_UP');

  return adds;
}
