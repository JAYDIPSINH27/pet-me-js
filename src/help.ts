/**
 * Centralized help text (kept in one place so CLI and README stay in sync).
 */
import { bold, dim } from './utils';

const HELP = `
${bold('pet-me — your console Tamagotchi')}

Usage:
  pet-me ${dim('<command>')} ${dim('[options]')}

Commands:
  ${bold('status')}                     Show pet status
  ${bold('feed')} ${dim('[food|toys]')}         Feed your pet (default: food)
  ${bold('play')} ${dim('[rock|paper|scissors]')}
                                  Play mini-game (RPS)
  ${bold('medicate')}                   Use medicine if sick
  ${bold('hatch')} ${dim('[--name NAME]')}       Hatch a new pet and switch to it
  ${bold('list')}                       List all pets
  ${bold('switch')} ${dim('<id|name>')}          Switch current pet
  ${bold('rename')} ${dim('<name>')}             Rename current pet
  ${bold('release')} ${dim('[<id|name>]')}       Release a pet (default: current)
  ${bold('log')} ${dim('[N]')}                   Show last N events (default 20)
  ${bold('config')} ${dim('[key value]')}        View or set config; keys:
                                  hungerRatePerHour, happinessDecayPerHour,
                                  healthDecayPerHour, randomEventHourlyChance,
                                  notifications
  ${bold('reset')}                      Clear ALL data (fresh start)
  ${bold('help')}                       Show this help menu
  ${bold('version')}                    Show version

Options:
  -h, --help                           Show help
  -v, --version                        Show version

Examples:
  pet-me status
  pet-me hatch --name Luna
  pet-me play rock
  pet-me feed
  pet-me config hungerRatePerHour 3
`;

export function printHelp(prefix?: string): void {
  if (prefix) console.log(prefix + '\n');
  console.log(HELP.trim() + '\n');
}
