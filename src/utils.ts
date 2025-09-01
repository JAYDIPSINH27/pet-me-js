/**
 * Utility helpers for colors, math, and time.
 * Dependency-free for a fast, zero-runtime-deps CLI.
 */
export type ColorFn = (s: string) => string;

const ansi = (c: string): ColorFn => (s: string) => `\x1b[${c}m${s}\x1b[0m`;

export const dim = ansi('2');
export const bold = ansi('1');
export const red = ansi('31');
export const green = ansi('32');
export const yellow = ansi('33');
export const blue = ansi('34');
export const magenta = ansi('35');
export const cyan = ansi('36');

export const clamp = (n: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, n));

export const nowISO = (): string => new Date().toISOString();

export const hoursBetween = (iso: string): number =>
  Math.max(0, (Date.now() - new Date(iso).getTime()) / 3_600_000);

export const chance = (p: number): boolean => Math.random() < p;

export function progress(label: string, value: number, colorFn: ColorFn = (s) => s): string {
  const blocks = Math.round(value / 10);
  const bar = '█'.repeat(blocks) + '░'.repeat(10 - blocks);
  return `${label}: ${colorFn(`[${bar}]`)} ${Math.round(value)}`;
}

export function shortId(): string {
  return Math.random().toString(36).slice(2, 7);
}
