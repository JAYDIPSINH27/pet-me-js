/**
 * Dual-mode storage:
 * - Browser: localStorage (key "pet-me-js")
 * - Node: per-user JSON file under app data directory
 */
import fs from 'fs';
import path from 'path';
import os from 'os';

const KEY = 'pet-me-js';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function nodeStatePath(): string {
  const base =
    process.env.APPDATA ||
    (process.platform === 'darwin'
      ? path.join(os.homedir(), 'Library', 'Application Support')
      : path.join(os.homedir(), '.config'));
  const dir = path.join(base, 'pet-me-js');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'state.json');
}

/** Read persisted JSON state, or null if missing/corrupt. */
export function read<T = unknown>(): T | null {
  if (isBrowser()) {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  const file = nodeStatePath();
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

/** Write JSON state atomically. */
export function write<T = unknown>(value: T): void {
  if (isBrowser()) {
    window.localStorage.setItem(KEY, JSON.stringify(value));
    return;
  }
  const file = nodeStatePath();
  fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf8');
}

/** Clear persisted state. */
export function clear(): void {
  if (isBrowser()) {
    window.localStorage.removeItem(KEY);
    return;
  }
  const file = nodeStatePath();
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
