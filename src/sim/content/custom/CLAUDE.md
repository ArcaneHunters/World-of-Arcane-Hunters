<!-- src/sim/content/custom/ -- fork-exclusive custom game content.
     This whole directory is owned by this fork and never exists in upstream.
     Root CLAUDE.md (fork maintenance, architecture) and src/sim/CLAUDE.md load alongside. -->

# src/sim/content/custom/ -- custom game content

This directory holds all fork-specific game content: custom zones, mobs, items,
quests, NPCs, and dungeons. It is the ONLY place to add content.

**Never add custom content to the upstream files** (`zone1.ts`, `classes.ts`,
`dungeons.ts`, etc.). Always add it here so upstream merges cannot conflict.

## Structure

Content is organized into per-zone subdirectories:

```
custom/
├── index.ts              -- barrel: assembles CUSTOM_* from zone sub-modules
├── i18n_ids.ts           -- fork-owned i18n ID extension point
├── CLAUDE.md             -- this file
└── dragons_blight/       -- Zone 4 (zMin:900, zMax:1260, levels 18-20)
    ├── items.ts          -- DRAGONS_BLIGHT_ITEMS
    ├── mobs.ts           -- DRAGONS_BLIGHT_MOBS + DRAGONS_BLIGHT_DUNGEON_MOBS
    ├── npcs.ts           -- DRAGONS_BLIGHT_NPCS
    ├── quests.ts         -- DRAGONS_BLIGHT_QUESTS + DRAGONS_BLIGHT_QUEST_ORDER
    ├── zones.ts          -- DRAGONS_BLIGHT_ZONES
    ├── camps.ts          -- DRAGONS_BLIGHT_CAMPS
    ├── props.ts          -- DRAGONS_BLIGHT_PROPS + DRAGONS_BLIGHT_OBJECTS + DRAGONS_BLIGHT_ROADS
    └── dungeons.ts       -- DRAGONS_BLIGHT_DUNGEON_DEFS
```

`index.ts` is the assembly barrel: it imports each zone's exports and spreads them
into the `CUSTOM_*` constants that `src/sim/data.ts` imports. The engine sees your
content identically to upstream content.

## Adding a new zone

1. Create a new subdirectory: `custom/<zone_slug>/`
2. Copy the file set from `dragons_blight/` as a template.
3. In each file, rename the export prefix (e.g. `DRAGONS_BLIGHT_` -> `MY_ZONE_`).
4. In `index.ts`, import the new zone's exports and spread them into each CUSTOM_* group.
5. For CUSTOM_CAMPS, append the new zone's camps AFTER all existing entries (see Determinism below).
6. For CUSTOM_PROPS, add the new zone's props to the `mergeCustomProps(...)` call.
7. Update `i18n_ids.ts` with the new zone's entity IDs.

## Adding content to Dragon's Blight

Edit the relevant file in `dragons_blight/`:

| Content | File |
|---|---|
| Overworld mobs | `dragons_blight/mobs.ts` (`DRAGONS_BLIGHT_MOBS`) |
| Dungeon-only mobs | `dragons_blight/mobs.ts` (`DRAGONS_BLIGHT_DUNGEON_MOBS`) |
| Items (quest, armor, weapons) | `dragons_blight/items.ts` |
| NPCs | `dragons_blight/npcs.ts` |
| Quests + order | `dragons_blight/quests.ts` |
| Zone definition | `dragons_blight/zones.ts` |
| Camps (spawn points) | `dragons_blight/camps.ts` |
| Props, objects, roads | `dragons_blight/props.ts` |
| Dungeon defs | `dragons_blight/dungeons.ts` |

### New mobs / creatures

Add to `DRAGONS_BLIGHT_MOBS` in `dragons_blight/mobs.ts`. Dungeon-only mobs go
in `DRAGONS_BLIGHT_DUNGEON_MOBS`.

ID rules:
- Use `custom_` prefix: `custom_direwolf` (prevents upstream name collisions)
- The id must match the `id` field in the record

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

To make mobs spawn in the world, add a `CampDef` entry to `DRAGONS_BLIGHT_CAMPS`
in `dragons_blight/camps.ts`.
Full guide: `docs/custom-content/mobs.md` -- `docs/custom-content/camps.md`

### New items

Add to `DRAGONS_BLIGHT_ITEMS` in `dragons_blight/items.ts`. Use `custom_` prefix.
Full guide: `docs/custom-content/items.md`

### New NPCs

Add to `DRAGONS_BLIGHT_NPCS` in `dragons_blight/npcs.ts`.
Full guide: `docs/custom-content/npcs.md`

### New zones / maps

Add a `ZoneDef` to `DRAGONS_BLIGHT_ZONES` in `dragons_blight/zones.ts` OR create
a new zone subdirectory for a completely separate zone.

**Upstream zone boundaries (verified from source):**
- Zone 1 (Eastbrook Vale): zMin -180, zMax 180
- Zone 2 (Mirefen Marsh): zMin 180, zMax 540
- Zone 3 (Thornpeak Heights): zMin 540, zMax 900

**Custom zone starts immediately after the last upstream zone.** The game's zone
system requires strict contiguity (`tests/progression.test.ts` checks
`ZONES[i].zMax === ZONES[i+1].zMin`). Dragon's Blight therefore starts at `zMin: 900`.

Full guide: `docs/custom-content/zones.md`

### New quests

Add to `DRAGONS_BLIGHT_QUESTS` and include the id in `DRAGONS_BLIGHT_QUEST_ORDER`
in `dragons_blight/quests.ts`.
Full guide: `docs/custom-content/quests.md`

### New dungeons

Add a `DungeonDef` to `DRAGONS_BLIGHT_DUNGEON_DEFS` in `dragons_blight/dungeons.ts`
and add dungeon-only mobs to `DRAGONS_BLIGHT_DUNGEON_MOBS` in `dragons_blight/mobs.ts`.

Dungeon index rules:
- Upstream uses indices 0-5: Hollow Crypt=0, Sunken Bastion=1, Gravewyrm=2,
  Drowned Temple=3, Nythraxis Crypt=4, Nythraxis Raid Arena=5
- **Custom dungeons: use index 6 only** (the single remaining valid slot)
- The x-origin is `900 + index * 600` -- index 6 = x: 4500
- **Critical:** x-origin MUST be below `ARENA_X_MIN` (4700 in this fork).

Full guide: `docs/custom-content/dungeons.md`

### Props and static world objects

Add buildings, wells, crates, etc. to `DRAGONS_BLIGHT_PROPS`.
Add interactable ground objects to `DRAGONS_BLIGHT_OBJECTS`.
Add terrain road markings to `DRAGONS_BLIGHT_ROADS`.
All are in `dragons_blight/props.ts`.
Full guides: `docs/custom-content/props.md` -- `docs/custom-content/map-layout.md`

## What you CANNOT add without touching upstream files

| Content | Safe here? | Upstream file needed |
|---|---|---|
| Mobs / creatures | Yes | None |
| Items | Yes | None |
| Zones / maps | Yes | None |
| Quests | Yes | None |
| NPCs | Yes | None |
| Dungeons | Yes | None |
| **New player classes** | **No** | `src/sim/types.ts` (the `PlayerClass` union type) |

## Determinism

Camps are appended LAST in every table (`data.ts` handles this). Do not reorder
existing entries in `DRAGONS_BLIGHT_CAMPS` or any zone's camps array -- each camp
draws world-gen RNG in array order, so insertion before an existing camp shifts all
later camps' spawn positions.

When adding a second zone, append its camps AFTER Dragon's Blight camps in `index.ts`:
```typescript
export const CUSTOM_CAMPS: CampDef[] = [
  ...DRAGONS_BLIGHT_CAMPS,   // existing -- never reorder within this
  ...NEXT_ZONE_CAMPS,        // new zone appended after
];
```

All mob IDs, item IDs, quest IDs referenced in your content must exist in the tables
before the sim starts.

## i18n wiring for new content

Custom content requires adding IDs to `src/sim/content/custom/i18n_ids.ts`:

1. **Mobs, NPCs, quests, zones, dungeons:** add their IDs to the matching
   `CUSTOM_MOB_IDS` / `CUSTOM_NPC_IDS` / `CUSTOM_QUEST_IDS` / `CUSTOM_ZONE_IDS` /
   `CUSTOM_DUNGEON_IDS` arrays.

2. **Items:** add each item ID to `CUSTOM_ITEM_ENTITY_IDS` and its English name
   (in the matching position) to `CUSTOM_ITEM_EN_NAMES`. The arrays are positional.

After editing `i18n_ids.ts`, regenerate and verify:
```bash
npm run i18n:gen && node scripts/i18n_resolved_hash.mjs --write
npx vitest run tests/i18n_status_registry.test.ts tests/i18n_resolved_equivalence.test.ts
```

## Secondary RNG isolation

`src/sim/sim.ts` initializes mob spawn positions using a secondary RNG instance for
`CUSTOM_CAMPS` (seeded with `this.cfg.seed ^ 0x464f524b`) to avoid shifting the main
RNG stream. Adding more entries to any zone's camps does NOT affect `this.rng`.
Parity golden traces still need regeneration after adding camps.

```bash
UPDATE_PARITY=1 npx vitest run tests/parity
npm test
```

## Testing

```bash
npm test                            # full test suite
npx vitest run tests/sim.test.ts   # focused sim test
```
