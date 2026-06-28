# Custom Content: Roads

Roads are polyline paths that paint a texture strip onto the terrain to visually
indicate a trail or road between locations. Roads for Dragon's Blight go in
`DRAGONS_BLIGHT_ROADS` in `src/sim/content/custom/dragons_blight/props.ts`.
The assembly barrel (`src/sim/content/custom/index.ts`) spreads these into
`CUSTOM_ROADS`.

Back to index: [ADDING-CUSTOM-CONTENT.md](./ADDING-CUSTOM-CONTENT.md)

---

## Format

Each road is an array of `{x, z}` waypoints. The renderer connects them into a
painted strip on the terrain. There is no limit on waypoints per road.

```typescript
export const DRAGONS_BLIGHT_ROADS: { x: number; z: number }[][] = [
  // First road: a polyline from point A to point B
  [
    { x: 0, z: 2000 },
    { x: 2, z: 2020 },
    { x: 1, z: 2040 },
    { x: 0, z: 2060 },
  ],
  // Second road: a branch off the first
  [
    { x: 0,  z: 2060 },
    { x: 30, z: 2090 },
    { x: 60, z: 2120 },
  ],
];
```

---

## Step-by-step

1. Plan the paths you want to mark on the terrain: hub-to-hub connections,
   dungeon approach paths, camp approach paths.
2. Open `src/sim/content/custom/dragons_blight/props.ts` and add road definitions
   inside `DRAGONS_BLIGHT_ROADS`. Each inner array is one road segment; add as
   many segments as needed:

```typescript
export const DRAGONS_BLIGHT_ROADS: { x: number; z: number }[][] = [
  // Main road through the zone
  [
    { x: 0, z: 2000 },  // zone entry
    { x: 2, z: 2020 },
    { x: 1, z: 2040 },
    { x: 0, z: 2060 },  // hub centre
  ],
  // Branch road to the dungeon entrance
  [
    { x: 0,   z: 2060 },
    { x: -25, z: 2020 },  // dungeon doorPos area
  ],
];
```

3. Run `npm test` to verify no errors.

---

## Tips

- Roads are purely visual -- they do not affect collision or pathfinding.
- Add a slight curve (small x offsets between waypoints) to avoid roads looking
  perfectly grid-aligned.
- Connect your hub to the previous zone's northern edge so players can follow
  the road from zone to zone.
- Keep waypoints roughly 20-40 units apart for smooth curves; very long gaps
  between points produce straight segments.
