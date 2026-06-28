import type { GroundObjectDef, ZonePropsDef } from '../../../types';

export const DRAGONS_BLIGHT_PROPS: ZonePropsDef = {
  buildings: [
    { kind: 'inn',   x: 0,   z: 962, w: 12, d: 10, rot: 0 },
    { kind: 'house', x: -18, z: 958, w: 10, d: 8,  rot: 0 },
  ],
  wells:     [{ x: 8, z: 955, r: 1.5 }],
  stalls:    [{ x: 16, z: 960, rot: Math.PI / 2, r: 2.5 }],
  tents:     [{ x: -22, z: 1082, rot: 0, scale: 1.0 }],
  campfires: [
    [0,   972],
    [-22, 1086],
  ],
  crates: [
    [20,  958],
    [-15, 963],
  ],
  fences:    [],
  mines:     [],
  docks:     [],
  mudHuts:   [],
  ruinRings: [{ x: -50, z: 1140, ringR: 18, columns: 6 }],
  graveyards: [{ x: -10, z: 958 }],
};

export const DRAGONS_BLIGHT_OBJECTS: GroundObjectDef[] = [];

export const DRAGONS_BLIGHT_ROADS: { x: number; z: number }[][] = [
  // Main road from zone entry into Blightwatch Post
  [
    { x: 0,  z: 900 },
    { x: 2,  z: 930 },
    { x: 0,  z: 960 },
  ],
  // Scout trail from hub north to Fenris's outpost
  [
    { x: 0,   z: 960  },
    { x: -8,  z: 1000 },
    { x: -15, z: 1040 },
    { x: -22, z: 1080 },
  ],
  // Path from scout outpost to Dragon's Maw dungeon entrance
  [
    { x: -22, z: 1080 },
    { x: -30, z: 1120 },
    { x: -40, z: 1160 },
    { x: -48, z: 1190 },
  ],
];
