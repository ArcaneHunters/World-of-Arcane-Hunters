import type { DungeonDef } from '../../../types';

export const DRAGONS_BLIGHT_DUNGEON_DEFS: Record<string, DungeonDef> = {
  custom_dragons_maw: {
    id: 'custom_dragons_maw',
    name: "Dragon's Maw",
    index: 6,                           // x-origin = 900 + 6*600 = 4500 (must be < ARENA_X_MIN 4700)
    doorPos: { x: -48, z: 1190 },      // overworld entrance portal
    entry: { x: 0, z: 20 },
    exitOffset: { x: 0, z: 5 },
    interior: 'dragons_maw',
    suggestedPlayers: 3,
    enterText: "The heat is suffocating. Something vast stirs in the darkness ahead.",
    leaveText: "You emerge from the Dragon's Maw, the air outside cold against your skin.",
    spawns: [
      { mobId: 'custom_dragonclaw_warden', x: -12, z: 35 },
      { mobId: 'custom_dragonclaw_warden', x: 12,  z: 35 },
      { mobId: 'custom_dragonclaw_warden', x: -15, z: 65 },
      { mobId: 'custom_dragonclaw_warden', x: 15,  z: 65 },
      { mobId: 'custom_dragonclaw_warden', x: -8,  z: 95 },
      { mobId: 'custom_dragonclaw_warden', x: 8,   z: 95 },
      { mobId: 'custom_ignaraxis',         x: 0,   z: 130 },
    ],
  },
};
