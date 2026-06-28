// Custom content barrel -- assembles CUSTOM_* exports consumed by src/sim/data.ts.
// Content lives in per-zone subdirectories. To add a new zone:
//   1. Create src/sim/content/custom/<zone_name>/ with the same file set as dragons_blight/.
//   2. Import the zone's exports below and spread them into each CUSTOM_* group.
//   3. For CUSTOM_CAMPS, append the new zone's camps AFTER all existing zones' camps
//      (never reorder -- each camp draws RNG in array position order).
//   4. For CUSTOM_PROPS, spread the new zone's ZonePropsDef arrays into mergeCustomProps.
// See docs/custom-content/ADDING-CUSTOM-CONTENT.md for the full guide.

import type { CampDef, GroundObjectDef, ZonePropsDef } from '../../types';

// ---------------------------------------------------------------------------
// Dragon's Blight -- Zone 4 (zMin:900, zMax:1260, levels 18-20)
// ---------------------------------------------------------------------------
import { DRAGONS_BLIGHT_ITEMS } from './dragons_blight/items';
import { DRAGONS_BLIGHT_MOBS, DRAGONS_BLIGHT_DUNGEON_MOBS } from './dragons_blight/mobs';
import { DRAGONS_BLIGHT_NPCS } from './dragons_blight/npcs';
import { DRAGONS_BLIGHT_QUESTS, DRAGONS_BLIGHT_QUEST_ORDER } from './dragons_blight/quests';
import { DRAGONS_BLIGHT_ZONES } from './dragons_blight/zones';
import { DRAGONS_BLIGHT_CAMPS } from './dragons_blight/camps';
import { DRAGONS_BLIGHT_PROPS, DRAGONS_BLIGHT_OBJECTS, DRAGONS_BLIGHT_ROADS } from './dragons_blight/props';
import { DRAGONS_BLIGHT_DUNGEON_DEFS } from './dragons_blight/dungeons';

// ---------------------------------------------------------------------------
// Merge helpers
// ---------------------------------------------------------------------------

// Combines multiple ZonePropsDef objects by concatenating each array field.
// Add new zones by appending their props to the call below.
function mergeCustomProps(...sets: ZonePropsDef[]): ZonePropsDef {
  return {
    buildings:    sets.flatMap((s) => s.buildings),
    wells:        sets.flatMap((s) => s.wells),
    stalls:       sets.flatMap((s) => s.stalls),
    mines:        sets.flatMap((s) => s.mines),
    docks:        sets.flatMap((s) => s.docks),
    tents:        sets.flatMap((s) => s.tents),
    crates:       sets.flatMap((s) => s.crates),
    campfires:    sets.flatMap((s) => s.campfires),
    mudHuts:      sets.flatMap((s) => s.mudHuts),
    ruinRings:    sets.flatMap((s) => s.ruinRings),
    fences:       sets.flatMap((s) => s.fences),
    graveyards:   sets.flatMap((s) => s.graveyards),
    delveMarkers: sets.flatMap((s) => s.delveMarkers ?? []),
  };
}

// ---------------------------------------------------------------------------
// CUSTOM_* exports (consumed by src/sim/data.ts and src/sim/sim.ts)
// ---------------------------------------------------------------------------

export const CUSTOM_ITEMS = {
  ...DRAGONS_BLIGHT_ITEMS,
};

export const CUSTOM_MOBS = {
  ...DRAGONS_BLIGHT_MOBS,
};

export const CUSTOM_DUNGEON_MOBS = {
  ...DRAGONS_BLIGHT_DUNGEON_MOBS,
};

export const CUSTOM_NPCS = {
  ...DRAGONS_BLIGHT_NPCS,
};

export const CUSTOM_QUESTS = {
  ...DRAGONS_BLIGHT_QUESTS,
};

export const CUSTOM_QUEST_ORDER: string[] = [
  ...DRAGONS_BLIGHT_QUEST_ORDER,
  // new zones: append their QUEST_ORDER arrays here
];

export const CUSTOM_ZONES = [
  ...DRAGONS_BLIGHT_ZONES,
  // new zones: append their ZoneDef arrays here
];

// CAMPS: maintain cross-zone order -- each camp draws secondary RNG in array position.
// Always append new zones' camps AFTER all existing zones' camps.
export const CUSTOM_CAMPS: CampDef[] = [
  ...DRAGONS_BLIGHT_CAMPS,
  // new zones: append their camps here, in zone order
];

export const CUSTOM_OBJECTS: GroundObjectDef[] = [
  ...DRAGONS_BLIGHT_OBJECTS,
  // new zones: append their objects here
];

export const CUSTOM_ROADS: { x: number; z: number }[][] = [
  ...DRAGONS_BLIGHT_ROADS,
  // new zones: append their road arrays here
];

// PROPS: data.ts passes CUSTOM_PROPS into its own mergeProps() call.
// Merge all custom zones' ZonePropsDef here so data.ts still receives one object.
export const CUSTOM_PROPS: ZonePropsDef = mergeCustomProps(
  DRAGONS_BLIGHT_PROPS,
  // new zones: add their props here
);

export const CUSTOM_DUNGEON_DEFS = {
  ...DRAGONS_BLIGHT_DUNGEON_DEFS,
};
