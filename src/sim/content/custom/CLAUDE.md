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
- Temple dungeons use higher indices (defined in `temple.ts`)
- Custom dungeons: **use index 10+ to be safe** (e.g. `index: 10`, `index: 11`, ...)
- The x-origin of each dungeon is `900 + index * 600` -- so index 10 = x: 6900

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

Custom content requires changes to two upstream files so the UI can resolve
names and text through `tEntity()`. Do this in the same commit as the content:

1. **Mobs, NPCs, quests, zones, dungeons:** add their IDs to the matching arrays
   in `src/ui/world_entity_i18n.ts` (`MOB_IDS`, `NPC_IDS`, `QUEST_IDS`,
   `ZONE_IDS`, `DUNGEON_IDS`). The build auto-generates English from the sim data;
   you do not need to touch locale files (they are English-filled at PR tier and
   translated by the maintainer at release tier).

2. **Items in `CUSTOM_ITEMS`:** add each item ID to `ITEM_ENTITY_IDS` and its
   English name to the `en` block in `src/ui/i18n.catalog/items.ts`.

After both edits, regenerate and verify:
```bash
npm run i18n:gen && node scripts/i18n_resolved_hash.mjs --write
npx vitest run tests/i18n_status_registry.test.ts tests/i18n_resolved_equivalence.test.ts
```

## Testing

After adding content:
```bash
npm test                                 # run the full test suite
npx vitest run tests/sim.test.ts         # focused sim test
```

**Adding camps to `CUSTOM_CAMPS`** shifts the world-gen RNG draw order (camps are
appended last and each draws RNG in array order). Two test artifacts must be
updated when the camp count changes:

1. **Parity golden traces** -- always regenerate after any content change:
   ```bash
   UPDATE_PARITY=1 npx vitest run tests/parity
   ```

2. **Delves test seed** -- `tests/delves.test.ts` has a seed-indexed roll
   (`rollFor(48)`) that was updated from the upstream value of `42` because the 9
   Dragon's Blight camps shifted the RNG draw order. If you add more camps and
   `tests/delves.test.ts` fails, update the index to match the value reported in
   the failure message. See `docs/MAINTAINING-FORK.md` for the full re-derivation
   procedure.

Content that references non-existent IDs (a mob's `loot` itemId, a quest's
`targetMobId`) will cause runtime errors when the sim tries to resolve them.
