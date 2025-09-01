/**
 * Mini-games (currently Rock–Paper–Scissors).
 */
import { green, red, yellow } from './utils';

export type RPSMove = 'rock' | 'paper' | 'scissors';
export type RPSResult = 'win' | 'draw' | 'lose' | 'none';

export function rps(userMove?: RPSMove | null): { result: RPSResult; cpu: RPSMove } {
  const opts: RPSMove[] = ['rock', 'paper', 'scissors'];
  const cpu = opts[Math.floor(Math.random() * 3)];
  if (!userMove || !opts.includes(userMove)) {
    console.log(yellow(`Choose a move with: pet-me play -- rock|paper|scissors`));
    return { result: 'none', cpu };
  }
  const u = userMove;
  const wins =
    (u === 'rock' && cpu === 'scissors') ||
    (u === 'paper' && cpu === 'rock') ||
    (u === 'scissors' && cpu === 'paper');

  if (u === cpu) {
    console.log(yellow(`Draw! CPU picked ${cpu}.`));
    return { result: 'draw', cpu };
  }
  if (wins) {
    console.log(green(`You win! CPU picked ${cpu}.`));
    return { result: 'win', cpu };
  }
  console.log(red(`You lose! CPU picked ${cpu}.`));
  return { result: 'lose', cpu };
}
