pet-me-js - Virtual Terminal Pet (TypeScript)
=============================================

A tiny Tamagotchi-style virtual pet that lives in your terminal.
Built with TypeScript, zero runtime dependencies, adorable ASCII art, evolutions,
random events, a mini-game, inventory, multiple pets, and achievements.

Badges (add real ones in your repo):
- npm: pet-me-js
- license: MIT
- language: TypeScript

Features
--------
- Evolutions: egg → baby → teen → adult (age & care based)
- ASCII moods: art changes with happiness, hunger, and sickness
- Random events: find items, mood boosts, occasional sickness
- Mini-game: Rock–Paper–Scissors to boost happiness
- Inventory: food, toys, meds
- Multiple pets: hatch, list, switch, rename, release
- Achievements: 7-day survivor, month keeper, perfect diet, etc.
- Zero deps: fast installs, portable CLI

Install
-------
Try instantly (no install):
  npx pet-me-js help

Or install globally:
  npm i -g pet-me-js
  pet-me help

Note: Package name is 'pet-me-js'; CLI command is 'pet-me'.

Command Reference
-----------------
Use `pet-me help` (or `-h` / `--help`) anytime to see this menu.

  pet-me status                 Show pet status
  pet-me feed [food|toys]       Feed your pet (default: food)
  pet-me play [rock|paper|scissors]
                                Play mini-game (RPS)
  pet-me medicate               Use medicine if sick
  pet-me hatch [--name NAME]    Hatch a new pet and switch to it
  pet-me list                   List all pets
  pet-me switch <id|name>       Switch current pet
  pet-me rename <name>          Rename current pet
  pet-me release [<id|name>]    Release a pet (default: current)
  pet-me log [N]                Show last N events (default 20)
  pet-me config [key value]     View or set config; keys:
                                  hungerRatePerHour, happinessDecayPerHour,
                                  healthDecayPerHour, randomEventHourlyChance,
                                  notifications
  pet-me reset                  Clear ALL data (fresh start)
  pet-me help                   Show help
  pet-me version                Show version

Examples
--------
  npx pet-me-js hatch --name Luna
  npx pet-me-js play rock
  npx pet-me-js feed
  npx pet-me-js medicate
  npx pet-me-js list
  npx pet-me-js switch <id>
  npx pet-me-js config hungerRatePerHour 3

Data & Storage
--------------
State is a single JSON file containing all pets, configuration, and an event log.
- Node:   ~/.config/pet-me-js/state.json (Linux)
          %APPDATA%/pet-me-js/state.json (Windows)
          ~/Library/Application Support/pet-me-js/state.json (macOS)
- Browser (future optional build): localStorage key 'pet-me-js'

Config (tune difficulty)
------------------------
- hungerRatePerHour (number)
- happinessDecayPerHour (number)
- healthDecayPerHour (number)
- randomEventHourlyChance (0–1)
- notifications (boolean; reserved for future desktop alerts)

Set via CLI:
  pet-me config hungerRatePerHour 3
  pet-me config randomEventHourlyChance 0.15

Development
-----------
  git clone https://github.com/yourname/pet-me-js
  cd pet-me-js
  npm i
  npm run build
  node dist/bin/pet-me.js help

Project Structure
-----------------
src/
  types.ts        - Domain types
  utils.ts        - Colors, time, clamps, progress bars
  ascii.ts        - ASCII sprites by stage & mood
  achievements.ts - Badge logic
  minigames.ts    - Rock–Paper–Scissors
  storage.ts      - Local storage (browser) or file (Node)
  state.ts        - Constructors, load/save, current pet selection
  engine.ts       - Pure simulation (evolve, events, tickOne)
  actions.ts      - User-facing operations + printing
  help.ts         - Central help text for CLI
bin/
  pet-me.ts       - CLI dispatcher (supports help & version)

Keywords (package.json -> keywords)
-----------------------------------
pet, virtual-pet, tamagotchi, game, fun, cli, node, javascript, typescript

Versioning & Publishing
-----------------------
We follow SemVer. To publish:
  npm version 1.0.1
  npm publish --access public

Roadmap
-------
- Browser bundle (UMD/ESM)
- Desktop notifications
- Additional mini-games
- Plugin API
- Localization

License
-------
GNU © Jaydipsinh Padhiyar
