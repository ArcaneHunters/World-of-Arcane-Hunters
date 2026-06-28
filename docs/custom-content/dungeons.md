# Custom Content: Dungeons

Dungeons are instanced interior areas entered through a portal in the overworld.
Each instance has its own coordinate space. Dungeons for Dragon's Blight go in
`DRAGONS_BLIGHT_DUNGEON_DEFS` in `src/sim/content/custom/dragons_blight/dungeons.ts`.
Dungeon-exclusive mobs go in `DRAGONS_BLIGHT_DUNGEON_MOBS` in
`src/sim/content/custom/dragons_blight/mobs.ts`. The assembly barrel
(`src/sim/content/custom/index.ts`) spreads these into `CUSTOM_DUNGEON_DEFS` and
`CUSTOM_DUNGEON_MOBS`.

For the dungeon mob field reference, see [mobs.md](./mobs.md).

Back to index: [ADDING-CUSTOM-CONTENT.md](./ADDING-CUSTOM-CONTENT.md)

---

## Index and coordinate rules

**Index rule:** Upstream dungeons use indices 0-5:
- 0: Hollow Crypt, 1: Sunken Bastion, 2: Gravewyrm, 3: Drowned Temple
- 4: Nythraxis Crypt, 5: Nythraxis Raid Arena

**Custom dungeons must use index 6.**

**Critical constraint: `900 + index * 600` must be less than `ARENA_X_MIN` (4700 in
this fork -- shifted from upstream's 4200 to open this slot; see `docs/MAINTAINING-FORK.md`).**
`dungeonAt()` returns null for x >= ARENA_X_MIN and the dungeon renders as a black void.

**x-origin formula:** `900 + index * 600`
- index 6 = x origin at 4500 (the only valid custom slot)

Spawn coordinates inside the dungeon are **relative to the instance origin** (offset
from that x value, with z near 0). The overworld `doorPos` uses regular world
coordinates and should be placed inside your custom zone's z band.

---

## DungeonDef fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Unique ID with `custom_` prefix |
| `name` | string | yes | Dungeon name (English) |
| `index` | number | yes | Use 6 for custom (only valid slot; x=4500 < ARENA_X_MIN 4700) |
| `doorPos` | `{x, z}` | yes | Overworld entrance portal position |
| `entry` | `{x, z}` | yes | Player arrival point inside the dungeon (instance-local) |
| `exitOffset` | `{x, z}` | yes | Exit portal position inside the dungeon (instance-local) |
| `spawns` | DungeonSpawn[] | yes | Mob spawn list (instance-local coordinates) |
| `interior` | string | yes | Interior type -- see Interior types below |
| `suggestedPlayers` | number | yes | Recommended group size |
| `enterText` | string | yes | Chat message when player enters (English) |
| `leaveText` | string | yes | Chat message when player leaves (English) |
| `overworldDoor` | boolean | no | Set false if door is only reachable from another dungeon |

**DungeonSpawn shape:**
```typescript
{ mobId: string, x: number, z: number }
// Coordinates are relative to the instance x-origin (instance-local)
```

---

## Interior types

The `interior` field controls both the 3D geometry (floor, walls, ceiling, obstacles) and
the visual theme (torch color, dressing). **Every interior string must be registered in
three places** -- the layout in `src/sim/dungeon_layout.ts`, the renderer case in
`src/render/dungeon.ts`, and the collider set in `src/sim/colliders.ts`. Using an
unregistered string silently falls back to the crypt layout (wrong geometry, wrong colliders).

**Available interior types:**

| String | Layout file constant | Visual theme | Geometry |
|---|---|---|---|
| `'crypt'` | `CRYPT_LAYOUT` | Blue torch flame, stone coffins | Single nave, z -19..112 |
| `'sanctum'` | `SANCTUM_LAYOUT` | Green ritual fire, necromantic | Three chambers with narrow waists at z 67/115 |
| `'temple'` | `TEMPLE_LAYOUT` | Moon-violet, flooded reliquaries | Two chambers, waist at z 66 |
| `'nythraxis'` | `NYTHRAXIS_LAYOUT` | Dark soul-ward violet | Wide raid room (230u), z -19..126 |
| `'dragons_maw'` | `DRAGONS_MAW_LAYOUT` | Dark stone (sanctum palette) | Single open lair, z -19..150, no waists |

**CRITICAL: spawn positions must fit inside the layout.**
Each layout defines walls and chamber waists that create impassable OBB colliders.
Spawning a mob inside a collider makes it appear to float and blocks navigation.
Check your spawn coordinates against the layout geometry before using it:

```
'crypt':    single nave, side walls at |x|=23, single boss room, no waists
'sanctum':  waists at z=67 and z=115 narrow the passage to |x|<5 (8-unit corridor)
            - spawns at |x|>5 within z 62-72 or z 112-118 will clip into the walls
'temple':   waist at z=66 narrows to |x|<5 (same as sanctum)
'dragons_maw': no waists, fully open single chamber -- safe for any x offset
```

**Adding a new interior type for a future custom dungeon:**
If none of the existing types fit, you can add a new one -- but it requires editing
four upstream files and must be documented in `docs/MAINTAINING-FORK.md`:
1. Add your string to the `interior` union in `DungeonDef` in `src/sim/types.ts`
   (`'crypt' | 'sanctum' | 'temple' | 'nythraxis' | 'dragons_maw' | 'your_type'`)
2. Define a `YOUR_LAYOUT: DungeonLayout` in `src/sim/dungeon_layout.ts` and export it
3. Import it in `src/render/dungeon.ts` and add a case in `buildInterior` (layout chain)
   and `variantFor` (choose the closest existing visual variant)
4. Import it in `src/sim/colliders.ts`, call `layoutColliders(YOUR_LAYOUT)`, and add
   the result to `INTERIOR_COLLIDERS` under your string key
5. Document all four upstream file changes in `docs/MAINTAINING-FORK.md`

---

## Step-by-step

1. Add the dungeon mobs to `DRAGONS_BLIGHT_DUNGEON_MOBS` in `dragons_blight/mobs.ts`
   (see [mobs.md](./mobs.md)).
2. Choose an index (10+ and unique per dungeon). Calculate the x-origin:
   `900 + index * 600`.
3. Plan instance-local spawn coordinates (x offsets from 0, z starting near 20-40
   for the first encounter).
4. Open `src/sim/content/custom/dragons_blight/dungeons.ts` and add the dungeon
   inside `DRAGONS_BLIGHT_DUNGEON_DEFS`:

```typescript
export const DRAGONS_BLIGHT_DUNGEON_DEFS: Record<string, DungeonDef> = {
  custom_ashenmoor_crypt: {
    id: 'custom_ashenmoor_crypt',
    name: 'Ashenmoor Crypt',
    index: 6,                               // x-origin = 900 + 6*600 = 4500 (must be < ARENA_X_MIN 4700)
    doorPos: { x: -50, z: 2020 },          // overworld entrance (inside custom zone)
    entry: { x: 0, z: 20 },               // player appears here inside
    exitOffset: { x: 0, z: 5 },           // exit portal, instance-local
    interior: 'crypt',
    suggestedPlayers: 3,
    enterText: 'The crypt air is cold and still.',
    leaveText: 'You emerge from the Ashenmoor Crypt.',
    spawns: [
      { mobId: 'custom_crypt_guardian', x: 0,   z: 40 },
      { mobId: 'custom_crypt_guardian', x: -15, z: 60 },
      { mobId: 'custom_crypt_guardian', x: 15,  z: 60 },
      { mobId: 'custom_crypt_guardian', x: 0,   z: 80 },  // final boss position
    ],
  },
};
```

5. Optionally place a prop (building or visual marker) near `doorPos` in
   `DRAGONS_BLIGHT_PROPS` to mark the dungeon entrance (see [props.md](./props.md)).
6. Run `npm test` to verify no errors.

---

## Tips

- Instance-local z increases as players move deeper into the dungeon. Place early
  trash mobs at low z (20-50) and the final boss near the layout's `dais.z` (the
  raised boss platform). Check the layout table above for each interior's z range.
- Use `x` offsets to spread mobs across the aisle -- but verify the offsets do not
  overlap any waist colliders (see Interior types above).
- Use `x` offsets to create side rooms and branching corridors.
- `elite: true` on dungeon mobs doubles their effective HP and damage relative to
  their base stats -- standard for non-boss dungeon encounters.
- `boss: true` should be reserved for the final encounter in the dungeon.
- `suggestedPlayers: 3` is standard for a 3-person dungeon; use `5` for a
  full-party dungeon.
