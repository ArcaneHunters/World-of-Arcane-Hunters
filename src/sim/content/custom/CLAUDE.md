<!-- src/sim/content/custom/ -- fork-exclusive custom game content.
     This whole directory is owned by this fork and never exists in upstream.
     Root CLAUDE.md (fork maintenance, architecture) and src/sim/CLAUDE.md load alongside. -->

# src/sim/content/custom/ -- custom game content

This directory holds all fork-specific game content: custom zones, mobs, items,
quests, NPCs, and dungeons. It is the ONLY place to add content.

**Never add custom content to the upstream files** (`zone1.ts`, `classes.ts`,
`dungeons.ts`, etc.). Always add it here so upstream merges cannot conflict.

## How it works

`index.ts` exports named constant groups (`CUSTOM_MOBS`, `CUSTOM_ITEMS`, etc.).
`src/sim/data.ts` imports and appends these to the engine's flat lookup tables.
The engine (`sim.ts`) sees your content identically to upstream content.

## Adding content

Full step-by-step guides, field references, and examples for every content type
live in `docs/custom-content/`. Links are provided in each section below.

### New mobs / creatures
Add to `CUSTOM_MOBS` in `index.ts`. Each entry is a `MobTemplate` from `../types`.
Dungeon-only mobs go in `CUSTOM_DUNGEON_MOBS` (same shape, never appear overworld).

ID rules:
- Use a descriptive snake_case id with a `custom_` prefix: `custom_direwolf`
- The prefix prevents future upstream names from colliding with yours
- The id must match the `id` field in the `MobTemplate` record

```typescript
custom_direwolf: {
  id: 'custom_direwolf',
  name: 'Dire Wolf',
  minLevel: 15, maxLevel: 18,
  family: 'beast',
  hpBase: 55, hpPerLevel: 22,
  dmgBase: 9, dmgPerLevel: 2.2,
  attackSpeed: 1.8,
  armorPerLevel: 14,
  moveSpeed: 9,
  aggroRadius: 12,
  loot: [{ copper: 60, chance: 1 }],
  scale: 1.1, color: 0x555555,
},
```

To make mobs spawn in the world, add a `CampDef` entry to `CUSTOM_CAMPS`.
Full guide: `docs/custom-content/mobs.md` -- `docs/custom-content/camps.md`

### New items
Add to `CUSTOM_ITEMS` in `index.ts`. Each entry is an `ItemDef` from `../types`.
Use `custom_` prefix. Items used only as quest objectives can have `kind: 'quest'`.
Full guide: `docs/custom-content/items.md`

### New NPCs
Add to `CUSTOM_NPCS` in `index.ts`. Each entry is a `NpcDef` from `../types`.
NPCs stand at a fixed world position and can give quests, sell items, or both.
Full guide: `docs/custom-content/npcs.md`

### New zones / maps
Add a `ZoneDef` to `CUSTOM_ZONES`. Zones are a north-running strip:
- `zMin`/`zMax` define the z-axis band (must be higher than the last upstream zone)
- `biome` controls terrain color and texture (`'vale'`, `'marsh'`, `'peaks'`)
- `hub` is the main settlement (terrain flattens there)
- `graveyard` is where players respawn in this zone

**Upstream zone boundaries (verified from source):**
- Zone 1 (Eastbrook Vale): zMin -180, zMax 180
- Zone 2 (Mirefen Marsh): zMin 180, zMax 540
- Zone 3 (Thornpeak Heights): zMin 540, zMax 900

**Start custom zones immediately after the last upstream zone.** The game's zone
system requires strict contiguity (`tests/progression.test.ts` checks
`ZONES[i].zMax === ZONES[i+1].zMin`), so a gap between Zone 3 (zMax 900) and your
custom zone will fail the test. Dragon's Blight therefore starts at `zMin: 900`.

**After any upstream merge:** if upstream adds a new zone (e.g. Zone 4 at 900-1260),
CUSTOM_ZONES will need their zMin/zMax shifted upward and all content z-positions
updated to match. See `docs/custom-content/zones.md` and `docs/MAINTAINING-FORK.md`
for the overlap detection and recovery procedure.

Add mob spawn points to `CUSTOM_CAMPS` with `center.z` inside your zone's band.
Full guide: `docs/custom-content/zones.md`

### New quests
Add to `CUSTOM_QUESTS` (a `QuestDef`) and list the id in `CUSTOM_QUEST_ORDER`
(determines quest-log order and level-gate progression).
Full guide: `docs/custom-content/quests.md`

### New dungeons
Add a `DungeonDef` to `CUSTOM_DUNGEON_DEFS` and any dungeon-only mobs to
`CUSTOM_DUNGEON_MOBS`.

Dungeon index rules:
- Upstream uses indices 0-2 (Hollow Crypt, Sunken Bastion, Gravewyrm)
- Temple dungeon uses index 3 (defined in `temple.ts`)
- Custom dungeons: **use index 4 or 5 only** (e.g. `index: 4`, `index: 5`)
- The x-origin is `900 + index * 600` -- index 4 = x: 3300, index 5 = x: 3900
- **Critical:** x-origin MUST be below `ARENA_X_MIN` (4200). `dungeonAt()` returns null
  for x >= 4200, causing a black void with no geometry. Indices 6+ would be above 4200.

**The `interior` field is critical.** It must be one of the registered interior
types -- each one maps to a specific room geometry AND collision set. Using a
wrong or unregistered string silently falls back to the crypt geometry with crypt
colliders, which won't match your spawn positions and can make mobs clip into walls
or appear to float. Available types:

| `interior` | Geometry | Use for |
|---|---|---|
| `'crypt'` | Single nave, z -19..112 | Classic undead dungeon |
| `'sanctum'` | Three chambers, waists at z 67/115 | Humanoid cult stronghold |
| `'temple'` | Two chambers, waist at z 66 | Flooded or ruin temple |
| `'nythraxis'` | Wide raid room (230u), z -19..126 | Raid boss encounters |
| `'dragons_maw'` | Single open lair, z -19..150, no waists | Dragon or cave lair |

**Verify spawn x offsets don't overlap waist colliders.** The `'sanctum'` and
`'temple'` interiors have narrow waist walls (OBBs) that block most of the x axis
at specific z values. See `docs/custom-content/dungeons.md` for the exact ranges.

If you need a new interior type, you must register it in four upstream files
(types.ts union, dungeon_layout.ts layout, dungeon.ts renderer, colliders.ts)
and document it in `docs/MAINTAINING-FORK.md`. See `docs/custom-content/dungeons.md`
for the step-by-step procedure.

Full guide: `docs/custom-content/dungeons.md`

### Props and static world objects
Add buildings, wells, crates, etc. to `CUSTOM_PROPS` (a `ZonePropsDef`).
Add interactable ground objects (herbs, ore) to `CUSTOM_OBJECTS`.
Add terrain road markings to `CUSTOM_ROADS`.
Full guides: `docs/custom-content/props.md` -- `docs/custom-content/ground-objects.md` -- `docs/custom-content/roads.md`

## What you CANNOT add without touching upstream files

| Content | Safe here? | Upstream file needed |
|---|---|---|
| Mobs / creatures | Yes | None |
| Items | Yes | None |
| Zones / maps | Yes | None |
| Quests | Yes | None |
| NPCs | Yes | None |
| Dungeons | Yes | None |
| **New player classes** | **No** | `src/sim/types.ts` (the `PlayerClass` union type must be extended) |

Adding a new player CLASS requires extending `PlayerClass` in `src/sim/types.ts`
(an upstream file) because `CLASSES: Record<PlayerClass, ClassDef>` is statically
typed to the union. Document any such change in `docs/MAINTAINING-FORK.md`.

## Determinism

Content is appended LAST in every table (`data.ts` handles this). Do not reorder
existing entries in `CUSTOM_CAMPS` -- each camp draws world-gen RNG in array order,
so insertion before an existing camp shifts all later camps' spawn positions.

All mob IDs, item IDs, quest IDs referenced in your content must exist in the tables
before the sim starts -- cross-reference within the same `index.ts` is fine.

## i18n wiring for new content

Custom content requires adding IDs to `src/sim/content/custom/i18n_ids.ts`,
the fork-owned extension point. The two upstream i18n files (`world_entity_i18n.ts`
and `items.ts`) import from it via spreads, so upstream merges to those files will
never wipe your custom entries.

1. **Mobs, NPCs, quests, zones, dungeons:** add their IDs to the matching
   `CUSTOM_MOB_IDS` / `CUSTOM_NPC_IDS` / `CUSTOM_QUEST_IDS` / `CUSTOM_ZONE_IDS` /
   `CUSTOM_DUNGEON_IDS` arrays in `src/sim/content/custom/i18n_ids.ts`.
   The build auto-generates English from the sim data; you do not need to touch
   locale files (they are English-filled at PR tier and translated by the
   maintainer at release tier).

2. **Items in `CUSTOM_ITEMS`:** add each item ID to `CUSTOM_ITEM_ENTITY_IDS` and
   its English name (in the matching position) to `CUSTOM_ITEM_EN_NAMES` in
   `src/sim/content/custom/i18n_ids.ts`. The arrays are positional: index N of
   `CUSTOM_ITEM_EN_NAMES` is the English display name for index N of
   `CUSTOM_ITEM_ENTITY_IDS`. **Never edit `src/ui/world_entity_i18n.ts` or
   `src/ui/i18n.catalog/items.ts` directly** -- those upstream files import from
   `i18n_ids.ts` via spreads and will be overwritten on merge.

After editing `i18n_ids.ts`, regenerate and verify:
```bash
npm run i18n:gen && node scripts/i18n_resolved_hash.mjs --write
npx vitest run tests/i18n_status_registry.test.ts tests/i18n_resolved_equivalence.test.ts
```

## Determinism and secondary RNG isolation

`src/sim/sim.ts` initializes all mob spawn positions during construction. To avoid
the custom camps shifting the main RNG stream (which would break parity tests and
any test that depends on downstream RNG state), custom camp mob initialization uses
a secondary RNG instance:

```typescript
const customCampSet = new Set(CUSTOM_CAMPS);
const customRng = new Rng(this.cfg.seed ^ 0x464f524b);
for (const camp of CAMPS) {
  const rng = customCampSet.has(camp) ? customRng : this.rng;
  // ... draws ang, r, level, facing, wanderTimer from rng
}
```

This means:
- Adding more `CUSTOM_CAMPS` entries does NOT affect `this.rng` (the main stream).
- The parity golden traces still need regeneration after adding camps (the secondary
  stream affects entity positions and IDs, which are part of the snapshot).
- `tests/delves.test.ts` uses the upstream `rollFor(42)` value; adding camps will
  NOT change this value (the fix is already in place).

## Testing

After adding content:
```bash
npm test                                 # run the full test suite
npx vitest run tests/sim.test.ts         # focused sim test
```

**Adding camps to `CUSTOM_CAMPS`** draws from the secondary `customRng` stream, so the
main RNG is NOT affected. However, parity golden traces must still be regenerated because
new entity IDs and positions appear in the snapshots:

```bash
UPDATE_PARITY=1 npx vitest run tests/parity
# Then re-run npm test to confirm all pass.
```

Content that references non-existent IDs (a mob's `loot` itemId, a quest's
`targetMobId`) will cause runtime errors when the sim tries to resolve them.
