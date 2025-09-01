#!/usr/bin/env node
/**
 * pet-me-js CLI entrypoint — dispatches subcommands to library actions.
 */
const pkg = require('../package.json') as { version?: string };
import {
  status,
  feed,
  play,
  medicate,
  hatch,
  listPets,
  switchPet,
  renamePet,
  releasePet,
  showLog,
  setConfig,
  resetAll,
} from '../src/actions';
import { printHelp } from '../src/help';

const [, , raw, arg1, arg2] = process.argv;
const cmd = (raw || 'status').toLowerCase();

// support --version/-v globally
if (cmd === '--version' || cmd === '-v' || cmd === 'version') {
  console.log(`pet-me-js v${pkg.version}`);
  process.exit(0);
}

// central command router
switch (cmd) {
  case 'help':
  case '--help':
  case '-h':
    printHelp();
    break;
  case 'feed':
    feed((arg1 as 'food' | 'toys') || 'food');
    break;
  case 'play':
    play((arg1 as 'rock' | 'paper' | 'scissors') || null);
    break;
  case 'medicate':
    medicate();
    break;
  case 'hatch': {
    const nameFlag = arg1 === '--name' ? arg2 : null;
    hatch(nameFlag || 'Pixel');
    break;
  }
  case 'list':
    listPets();
    break;
  case 'switch':
    switchPet(arg1);
    break;
  case 'rename':
    renamePet(arg1);
    break;
  case 'release':
    releasePet(arg1 || null);
    break;
  case 'log':
    showLog(arg1 ? Number(arg1) : 20);
    break;
  case 'config':
    if (arg1 && typeof arg2 !== 'undefined') {
      setConfig(arg1 as any, arg2);
      break;
    }
    // print keys then status tick
    setConfig();
    status();
    break;
  case 'status':
    status();
    break;
  case 'reset':
    resetAll();
    break;
  default:
    // unknown → help
    printHelp(`Unknown command: ${raw}`);
    process.exitCode = 1;
}
