/**
 * ASCII art sprites by stage & mood.
 */
import type { Stage, Mood } from './types';

const artMap: Record<Stage, Record<Mood, string[]>> = {
  egg: {
    neutral: ['   ____  ', '  / __ \\ ', ' | |  | |', ' | |  | |', ' | |__| |', '  \\____/ '],
    happy: ['   ____  ', '  / __ \\ ', ' | |  | |', ' | |  | |  ☆', ' | |__| |', '  \\____/ '],
    sad: ['   ____  ', '  / __ \\ ', ' | |  | |', ' | |  | |  .', ' | |__| |', '  \\____/ '],
    sick: ['   ____  ', '  / __ \\ ', ' | |  | |', ' | |  | |  🤢', ' | |__| |', '  \\____/ '],
  },
  baby: {
    neutral: ['  (\\_/) ', '  ( •_•)', ' / >🍪  '],
    happy: ['  (\\_/) ', '  ( •‿•)✧', ' / >🍪  '],
    sad: ['  (\\_/) ', '  ( •︵•)', ' /       '],
    sick: ['  (\\_/)', '  ( x_x)', ' /  🤢  '],
  },
  teen: {
    neutral: ['  /^_^\\  ', ' ( o o ) ', ' /  ⛱  \\ '],
    happy: ['  /^‿^\\  ', ' ( ^ ^ ) ', ' /  ✨  \\ '],
    sad: ['  /^_ _\\  ', ' ( - - ) ', ' /      \\ '],
    sick: ['  /^_ _\\  ', ' ( - x ) ', ' /  🤢  \\ '],
  },
  adult: {
    neutral: ['  /\\___/\\ ', ' (  • • ) ', ' (  >♡< ) '],
    happy: ['  /\\★__ /\\ ', ' (  ^ ^ ) ', ' (  >♡< ) '],
    sad: ['  /\\___/\\ ', ' (  - - ) ', ' (   ⌒  ) '],
    sick: ['  /\\___/\\ ', ' (  - x ) ', ' (  🤢  ) '],
  },
};

/** Render ASCII art for a given stage and mood. */
export function art(stage: Stage, mood: Mood): string {
  const s = artMap[stage] ?? artMap.egg;
  return (s[mood] ?? s.neutral).join('\n');
}
