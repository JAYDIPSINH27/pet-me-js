/**
 * Action layer: user-visible ops, printing, and persistence orchestration.
 */
import type { Inventory, Config } from './types';
import { art } from './ascii';
import { rps, RPSMove } from './minigames';
import { getCurrent, loadAll, saveAll, makePet } from './state';
import { tickOne } from './engine';
import {
  dim,
  bold,
  red,
  green,
  yellow,
  cyan,
  progress,
  clamp,
  nowISO,
  hoursBetween,
} from './utils';

/** Print status (ASCII art, bars, inventory) and save state. */
export function status(): void {
  const all = loadAll();
  const p = getCurrent(all);
  const hrs = hoursBetween(p.lastUpdate);
  if (hrs > 0.02) tickOne(p, hrs, all.config, all.log);
  saveAll(all);

  const mood: 'happy' | 'neutral' | 'sad' | 'sick' = !p.alive
    ? 'sad'
    : p.sick
      ? 'sick'
      : p.hunger > 75
        ? 'sad'
        : p.happiness > 60
          ? 'happy'
          : 'neutral';

  console.log(`${bold(`${p.name}`)} (${p.stage}) ${p.alive ? '💚' : '💀'}  day ${Math.floor(p.ageDays)}`);
  console.log(dim(`id: ${p.id}\n`));
  console.log(art(p.stage, mood) + '\n');
  console.log(progress('Hunger ', p.hunger, (s) => yellow(s)));
  console.log(progress('Happiness', p.happiness, (s) => green(s)));
  console.log(progress('Health  ', p.health, (s) => cyan(s)));
  console.log('');
  const inv = p.inventory;
  console.log(dim(`Inventory: 🍎 food x${inv.food ?? 0}  🎲 toys x${inv.toys ?? 0}  💊 meds x${inv.meds ?? 0}`));
  if (p.sick) console.log(red('Status: Sick (use "pet-me medicate")'));
  if (!p.alive) console.log(red('Status: Deceased (use "pet-me hatch" to start anew, or "release")'));
}

/** Feed the current pet with an inventory item (default: food). */
export function feed(which: keyof Inventory | 'food' = 'food'): void {
  const all = loadAll();
  const p = getCurrent(all);
  const hrs = hoursBetween(p.lastUpdate);
  if (hrs > 0.02) tickOne(p, hrs, all.config, all.log);

  if (!p.alive) {
    console.log(red('💀 Cannot feed a deceased pet.'));
    saveAll(all);
    return;
  }
  const count = p.inventory[which] ?? 0;
  if (count <= 0) {
    console.log(yellow(`No ${which} in inventory.`));
    saveAll(all);
    return status();
  }

  p.inventory[which] = count - 1;
  p.hunger = clamp(p.hunger - 35, 0, 100);
  p.happiness = clamp(p.happiness + 5, 0, 100);

  // streak: feeding while too hungry resets it
  if (p.hunger >= 50) p.perfectDietStreak = 0;
  else p.perfectDietStreak = (p.perfectDietStreak ?? 0) + 1;

  all.log.push(`${nowISO()} Fed ${p.name} (${which}).`);
  saveAll(all);
  console.log(green('🥕 Nom! Hunger down.'));
  status();
}

/** Play a mini-game (RPS) which affects happiness/hunger. */
export function play(userMove?: RPSMove | null): void {
  const all = loadAll();
  const p = getCurrent(all);
  const hrs = hoursBetween(p.lastUpdate);
  if (hrs > 0.02) tickOne(p, hrs, all.config, all.log);
  if (!p.alive) {
    console.log(red('💀 Cannot play with a deceased pet.'));
    saveAll(all);
    return;
  }

  const { result } = rps(userMove ?? null);
  if (result === 'win') {
    p.happiness = clamp(p.happiness + 25, 0, 100);
    p.hunger = clamp(p.hunger + 8, 0, 100);
  } else if (result === 'draw') {
    p.happiness = clamp(p.happiness + 5, 0, 100);
    p.hunger = clamp(p.hunger + 3, 0, 100);
  } else if (result === 'lose') {
    p.happiness = clamp(p.happiness - 5, 0, 100);
  }

  all.log.push(`${nowISO()} Played game (rps: ${result}).`);
  saveAll(all);
  status();
}

/** Heal sickness if you have meds; improves health. */
export function medicate(): void {
  const all = loadAll();
  const p = getCurrent(all);
  const hrs = hoursBetween(p.lastUpdate);
  if (hrs > 0.02) tickOne(p, hrs, all.config, all.log);

  if (!p.alive) {
    console.log(red('💀 Cannot medicate a deceased pet.'));
    saveAll(all);
    return;
  }
  if (!p.sick) {
    console.log(green('✅ Not sick.'));
    saveAll(all);
    return;
  }
  const meds = p.inventory.meds ?? 0;
  if (meds <= 0) {
    console.log(yellow('No meds in inventory.'));
    saveAll(all);
    return;
  }

  p.inventory.meds = meds - 1;
  p.sick = false;
  p.health = clamp(p.health + 30, 0, 100);
  all.log.push(`${nowISO()} Gave medicine to ${p.name}.`);
  saveAll(all);
  console.log(green('💊 Feeling better!'));
  status();
}

/** Hatch a new pet and switch current to it. */
export function hatch(name = 'Pixel'): void {
  const all = loadAll();
  const pet = makePet(name);
  all.pets[pet.id] = pet;
  all.currentPetId = pet.id;
  all.log.push(`${nowISO()} Hatched ${name} (${pet.id}).`);
  saveAll(all);
  console.log(green(`🐣 A new pet has hatched! Name: ${name} (id: ${pet.id})`));
  status();
}

/** List all pets with a quick status summary. */
export function listPets(): void {
  const all = loadAll();
  const rows = Object.values(all.pets).map(
    (p) =>
      `${p.id}  ${p.name.padEnd(10)}  ${p.stage.padEnd(5)}  ${
        p.alive ? '💚' : '💀'
      }  day ${Math.floor(p.ageDays)}`,
  );
  console.log(bold('Your Pets'));
  console.log(rows.length ? rows.join('\n') : '(none)');
  console.log(dim(`current: ${all.currentPetId || '(none)'}`));
}

/** Switch current pet by id or name. */
export function switchPet(idOrName?: string): void {
  if (!idOrName) return console.log(yellow('Provide a pet id or name.'));

  const all = loadAll();
  const found = Object.values(all.pets).find(
    (p) => p.id === idOrName || p.name.toLowerCase() === idOrName.toLowerCase(),
  );
  if (!found) return console.log(yellow('Pet not found.'));
  all.currentPetId = found.id;
  all.log.push(`${nowISO()} Switched to ${found.name} (${found.id}).`);
  saveAll(all);
  console.log(green(`Switched to ${found.name}.`));
  status();
}

/** Rename the current pet. */
export function renamePet(newName?: string): void {
  if (!newName) return console.log(yellow('Provide a new name.'));
  const all = loadAll();
  const p = getCurrent(all);
  const old = p.name;
  p.name = newName;
  all.log.push(`${nowISO()} Renamed ${old} to ${p.name}.`);
  saveAll(all);
  console.log(green(`Renamed to ${p.name}.`));
  status();
}

/** Release (delete) a pet by id/name; defaults to current. */
export function releasePet(idOrName?: string | null): void {
  const all = loadAll();
  let key = all.currentPetId;
  if (idOrName) {
    const found = Object.values(all.pets).find(
      (p) => p.id === idOrName || p.name.toLowerCase() === idOrName.toLowerCase(),
    );
    if (!found) return console.log(yellow('Pet not found.'));
    key = found.id;
  }
  if (!key) return console.log(yellow('No current pet to release.'));
  const gone = all.pets[key];
  if (!gone) return console.log(yellow('Pet not found.'));
  delete all.pets[key];
  const remaining = Object.keys(all.pets);
  all.currentPetId = remaining[0] ?? null;
  all.log.push(`${nowISO()} Released ${gone.name} (${gone.id}).`);
  saveAll(all);
  console.log(red(`Released ${gone.name}.`));
  if (remaining[0]) status();
}

/** Show recent log lines. */
export function showLog(limit = 20): void {
  const all = loadAll();
  const log = all.log.slice(-limit);
  console.log(bold(`Last ${log.length} events:`));
  console.log(log.join('\n'));
}

/** View or set a config key; values parsed as number|boolean|string. */
export function setConfig(k?: keyof Config, v?: string): void {
  const all = loadAll();
  if (!k) {
    console.log('Tip: pet-me config <key> <value>. Keys:', Object.keys(all.config).join(', '));
    return;
  }
  if (!(k in all.config)) {
    console.log(yellow(`Unknown config key. Valid: ${Object.keys(all.config).join(', ')}`));
    return;
  }
  let parsed: unknown = v;
  if (v === 'true' || v === 'false') parsed = v === 'true';
  else if (v !== undefined && !Number.isNaN(Number(v))) parsed = Number(v);

  // @ts-expect-error: dynamic assignment matching key type at runtime
  all.config[k] = parsed;
  all.log.push(`${nowISO()} Config ${String(k)}=${String(parsed)}`);
  saveAll(all);
  console.log(green(`Config updated: ${String(k)}=${String(parsed)}`));
}

/** Clear all persisted data. */
export function resetAll(): void {
  const all = loadAll();
  all.pets = {};
  all.currentPetId = null;
  all.log.push(`${nowISO()} Reset all state.`);
  saveAll(all);
  console.log(red('All data cleared. A fresh egg will appear next run.'));
}
