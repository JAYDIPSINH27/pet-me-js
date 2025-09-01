/**
 * Pure simulation logic (no I/O): evolve, random events, tick.
 */
import type { PetState, Config, Inventory } from './types';
import { clamp, chance, nowISO } from './utils';
import { awardable, labels } from './achievements';

/** Advance stage by age & care; cap progression for poor care. */
export function evolve(p: PetState): void {
  const d = p.ageDays;
  const care = (100 - p.hunger) + p.happiness + p.health; // 0..300

  if (d >= 7 && p.stage !== 'adult') p.stage = 'adult';
  else if (d >= 3 && p.stage !== 'teen') p.stage = 'teen';
  else if (d >= 1 && p.stage !== 'baby') p.stage = 'baby';

  if (care < 120 && p.stage === 'teen') p.stage = 'baby';
  if (care < 140 && p.stage === 'adult') p.stage = 'teen';
}

/** At most one random event per tick call. */
export function randomEvent(p: PetState, config: Config, log: string[]): void {
  if (!chance(config.randomEventHourlyChance)) return;

  const roll = Math.random();
  if (roll < 0.4) {
    const pool: (keyof Inventory)[] = ['food', 'toys', 'meds'];
    const item = pool[Math.floor(Math.random() * pool.length)];
    p.inventory[item] = (p.inventory[item] ?? 0) + 1;
    log.push(`${nowISO()} ${p.name} found ${item}!`);
  } else if (roll < 0.65) {
    p.happiness = clamp(p.happiness + 10, 0, 100);
    log.push(`${nowISO()} ${p.name} enjoyed a breeze. Happiness +10`);
  } else {
    p.sick = true;
    p.health = clamp(p.health - 20, 0, 100);
    log.push(`${nowISO()} ${p.name} caught a bug 🤒 (use "pet-me medicate")`);
  }
}

/** Apply decay, events, achievements for `hours` of elapsed time. */
export function tickOne(p: PetState, hours: number, config: Config, log: string[]): void {
  if (!p.alive) return;

  // decay
  p.hunger = clamp(p.hunger + hours * config.hungerRatePerHour, 0, 100);
  p.happiness = clamp(p.happiness - hours * config.happinessDecayPerHour, 0, 100);
  let healthDecay = hours * config.healthDecayPerHour * (p.sick ? 2 : 1);
  if (p.hunger > 80) healthDecay += hours * 1.5;
  if (p.happiness < 20) healthDecay += hours * 1.0;
  p.health = clamp(p.health - healthDecay, 0, 100);

  // time
  p.ageDays += hours / 24;

  // random event
  if (hours > 0.1) randomEvent(p, config, log);

  // death conditions
  if (p.health <= 0 || (p.hunger >= 100 && p.happiness <= 5)) {
    p.alive = false;
    log.push(`${nowISO()} ${p.name} has passed on 💀`);
  }

  // evolution & achievements
  evolve(p);
  const newAwards = awardable(p);
  if (newAwards.length) {
    const set = new Set([...(p.achievements ?? []), ...newAwards]);
    p.achievements = Array.from(set);
    newAwards.forEach((a) => log.push(`${nowISO()} Achievement unlocked: ${labels[a]}`));
  }

  // update heartbeat
  p.lastUpdate = nowISO();
}
