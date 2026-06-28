# Complete Working Example

This ties all content types together into one coherent custom zone with mobs,
NPCs, quests, camps, props, roads, and a dungeon. Copy and adapt this as a
starting template for your first custom zone.

The example creates a zone called "The Ashenmoor" with its own subdirectory:
`src/sim/content/custom/ashenmoor/`

Back to index: [ADDING-CUSTOM-CONTENT.md](./ADDING-CUSTOM-CONTENT.md)

---

## File layout

```
src/sim/content/custom/
  index.ts            <- assembly barrel (update this to import your zone)
  ashenmoor/
    items.ts
    mobs.ts
    npcs.ts
    quests.ts
    zones.ts
    camps.ts
    props.ts
    dungeons.ts
```

---

## ashenmoor/items.ts

```typescript
import type { ItemDef } from '../../../types';

export const ASHENMOOR_ITEMS: Record<string, ItemDef> = {
  custom_wolf_pelt: {
    id: 'custom_wolf_pelt',
    name: 'Wolf Pelt',
    kind: 'quest',
    quality: 'common',
    sellValue: 0,
    noVendorSell: true,
  },
  custom_iron_sword: {
    id: 'custom_iron_sword',
    name: 'Iron Sword',
    kind: 'weapon',
    slot: 'mainhand',
    quality: 'uncommon',
    sellValue: 120,
    weapon: { dps: 14, speed: 2.4, type: 'sword' },
    stats: { strength: 8, stamina: 5 },
  },
  custom_healing_potion: {
    id: 'custom_healing_potion',
    name: 'Healing Potion',
    kind: 'potion',
    sellValue: 10,
    buyValue: 50,
    potionHp: 300,
    quality: 'common',
  },
};
```

---

## ashenmoor/mobs.ts

```typescript
import type { MobTemplate } from '../../../types';

export const ASHENMOOR_MOBS: Record<string, MobTemplate> = {
  custom_direwolf: {
    id: 'custom_direwolf',
    name: 'Dire Wolf',
    minLevel: 18, maxLevel: 22,
    family: 'beast',
    hpBase: 60, hpPerLevel: 25,
    dmgBase: 10, dmgPerLevel: 2.5,
    attackSpeed: 1.8,
    armorPerLevel: 15,
    moveSpeed: 9,
    aggroRadius: 12,
    loot: [
      { copper: 80, chance: 1 },
      { itemId: 'custom_wolf_pelt', chance: 0.6, questId: 'custom_hunt_wolves' },
    ],
    scale: 1.2, color: 0x444444,
  },
};

export const ASHENMOOR_DUNGEON_MOBS: Record<string, MobTemplate> = {
  custom_crypt_guardian: {
    id: 'custom_crypt_guardian',
    name: 'Crypt Guardian',
    minLevel: 20, maxLevel: 20,
    family: 'undead',
    hpBase: 400, hpPerLevel: 0,
    dmgBase: 30, dmgPerLevel: 0,
    attackSpeed: 2.2,
    armorPerLevel: 40,
    moveSpeed: 5,
    aggroRadius: 15,
    elite: true,
    loot: [
      { copper: 200, chance: 1 },
      { itemId: 'custom_iron_sword', chance: 0.15 },
    ],
    scale: 1.4, color: 0x777799,
  },
};
```

---

## ashenmoor/npcs.ts

```typescript
import type { NpcDef } from '../../../types';

export const ASHENMOOR_NPCS: Record<string, NpcDef> = {
  custom_ranger_quinn: {
    id: 'custom_ranger_quinn',
    name: 'Ranger Quinn',
    title: 'Scout',
    pos: { x: 5, z: 2060 },
    facing: 0,
    color: 0x8B6914,
    questIds: ['custom_hunt_wolves'],
    greeting: 'The wolves beyond camp have grown bold. I need your help, $N.',
  },
  custom_supply_vendor: {
    id: 'custom_supply_vendor',
    name: 'Camp Supplier',
    title: 'Trade Goods',
    pos: { x: 10, z: 2055 },
    facing: Math.PI,
    color: 0xAA9977,
    questIds: [],
    vendorItems: ['custom_healing_potion'],
    greeting: 'Stock up before you head out.',
  },
};
```

---

## ashenmoor/quests.ts

```typescript
import type { QuestDef } from '../../../types';

export const ASHENMOOR_QUESTS: Record<string, QuestDef> = {
  custom_hunt_wolves: {
    id: 'custom_hunt_wolves',
    name: 'A Wolf Problem',
    giverNpcId: 'custom_ranger_quinn',
    turnInNpcId: 'custom_ranger_quinn',
    text: 'The dire wolves north of camp are attacking our scouts, $N. Kill 8 of them and bring me 5 pelts.',
    completionText: 'Well done, $N. The scouts can move freely now.',
    objectives: [
      { type: 'kill',    targetMobId: 'custom_direwolf', count: 8, label: 'Dire Wolves slain' },
      { type: 'collect', itemId: 'custom_wolf_pelt',      count: 5, label: 'Wolf Pelts collected' },
    ],
    xpReward: 1800,
    copperReward: 150,
    itemRewards: {
      warrior: 'custom_iron_sword',
      rogue:   'custom_iron_sword',
      mage:    'custom_healing_potion',
    },
    minLevel: 18,
  },
};

export const ASHENMOOR_QUEST_ORDER: string[] = [
  'custom_hunt_wolves',
];
```

---

## ashenmoor/zones.ts

```typescript
import type { ZoneDef } from '../../../types';

export const ASHENMOOR_ZONES: ZoneDef[] = [
  {
    id: 'custom_ashenmoor',
    name: 'The Ashenmoor',
    zMin: 2000, zMax: 2360,
    levelRange: [18, 25],
    biome: 'marsh',
    hub: { x: 0, z: 2060, radius: 30, name: 'Ashenmoor Camp' },
    graveyard: { x: -10, z: 2070 },
    lakes: [{ x: 60, z: 2120, radius: 40 }],
    pois: [
      { x: 0, z: 2060, label: 'Ashenmoor Camp' },
    ],
    welcome: 'The Ashenmoor stretches before you, bleak and fog-shrouded.',
  },
];
```

---

## ashenmoor/camps.ts

```typescript
import type { CampDef } from '../../../types';

// IMPORTANT: Never reorder or insert camps before existing entries.
// Each camp draws from the secondary customRng stream in array position order.
export const ASHENMOOR_CAMPS: CampDef[] = [
  { mobId: 'custom_direwolf', center: { x: 30,  z: 2040 }, radius: 25, count: 6 },
  { mobId: 'custom_direwolf', center: { x: -40, z: 2090 }, radius: 20, count: 4 },
];
```

---

## ashenmoor/props.ts

```typescript
import type { GroundObjectDef, ZonePropsDef } from '../../../types';

export const ASHENMOOR_PROPS: ZonePropsDef = {
  buildings: [
    { kind: 'inn', x: 0, z: 2060, w: 12, d: 10, rot: 0 },
  ],
  wells:      [{ x: 5, z: 2055, r: 1.5 }],
  stalls:     [],
  mines:      [],
  docks:      [],
  tents:      [],
  crates:     [],
  campfires:  [[0, 2070]],
  mudHuts:    [],
  ruinRings:  [],
  fences:     [],
  graveyards: [],
};

export const ASHENMOOR_OBJECTS: GroundObjectDef[] = [];

export const ASHENMOOR_ROADS: { x: number; z: number }[][] = [
  [
    { x: 0, z: 2000 },
    { x: 1, z: 2030 },
    { x: 0, z: 2060 },
  ],
];
```

---

## ashenmoor/dungeons.ts

```typescript
import type { DungeonDef } from '../../../types';

export const ASHENMOOR_DUNGEON_DEFS: Record<string, DungeonDef> = {
  custom_ashenmoor_crypt: {
    id: 'custom_ashenmoor_crypt',
    name: 'Ashenmoor Crypt',
    index: 6,                         // x-origin = 900 + 6*600 = 4500 (must be < ARENA_X_MIN 4700)
    doorPos: { x: -50, z: 2020 },    // overworld entrance portal
    entry: { x: 0, z: 20 },
    exitOffset: { x: 0, z: 5 },
    interior: 'crypt',
    suggestedPlayers: 3,
    enterText: 'The crypt air is cold and still.',
    leaveText: 'You emerge from the Ashenmoor Crypt.',
    spawns: [
      { mobId: 'custom_crypt_guardian', x: 0,   z: 40 },
      { mobId: 'custom_crypt_guardian', x: -15, z: 60 },
      { mobId: 'custom_crypt_guardian', x: 15,  z: 60 },
      { mobId: 'custom_crypt_guardian', x: 0,   z: 80 },
    ],
  },
};
```

---

## Wiring into index.ts

After creating the zone subdirectory, register the new zone in the assembly barrel:

```typescript
// src/sim/content/custom/index.ts  (excerpt showing where to add)

import { ASHENMOOR_ITEMS } from './ashenmoor/items';
import { ASHENMOOR_MOBS, ASHENMOOR_DUNGEON_MOBS } from './ashenmoor/mobs';
import { ASHENMOOR_NPCS } from './ashenmoor/npcs';
import { ASHENMOOR_QUESTS, ASHENMOOR_QUEST_ORDER } from './ashenmoor/quests';
import { ASHENMOOR_ZONES } from './ashenmoor/zones';
import { ASHENMOOR_CAMPS } from './ashenmoor/camps';
import { ASHENMOOR_PROPS, ASHENMOOR_OBJECTS, ASHENMOOR_ROADS } from './ashenmoor/props';
import { ASHENMOOR_DUNGEON_DEFS } from './ashenmoor/dungeons';

// Spread into the CUSTOM_* exports:
export const CUSTOM_ITEMS = { ...DRAGONS_BLIGHT_ITEMS, ...ASHENMOOR_ITEMS };
export const CUSTOM_MOBS  = { ...DRAGONS_BLIGHT_MOBS,  ...ASHENMOOR_MOBS  };
// ... and so on for each export

// For CUSTOM_CAMPS: Dragon's Blight camps MUST come first (RNG draw order)
export const CUSTOM_CAMPS: CampDef[] = [
  ...DRAGONS_BLIGHT_CAMPS,
  ...ASHENMOOR_CAMPS,        // new zone appended after existing zone(s)
];

// For CUSTOM_PROPS: add the new zone to mergeCustomProps
export const CUSTOM_PROPS: ZonePropsDef = mergeCustomProps(
  DRAGONS_BLIGHT_PROPS,
  ASHENMOOR_PROPS,
);
```

The external contract of `index.ts` (the `CUSTOM_*` exports) is unchanged;
`data.ts` and `sim.ts` see the same names regardless of how many zones exist.
