# Custom Creature Models -- Step-by-Step Guide

This guide covers two scenarios:

1. **Overriding an existing upstream creature** -- change the model or appearance
   of any mob that already exists in the game without touching upstream files.
2. **Adding a new creature** -- wire in a brand-new GLB model from a CC0 pack
   or a custom Blender export.

Everything described here is merge-safe. The only upstream file that was modified
is `src/render/characters/manifest.ts` (one import line + two spreads), and that
change is documented in `docs/MAINTAINING-FORK.md` for recovery after bad merges.

---

## How the visual system works

Every visible creature in the game goes through three steps:

```
Mob template ID
  -> visualKeyFor(entity)           [src/render/characters/manifest.ts]
     MOB_KEYS[templateId]           <- specific override (highest priority)
     FAMILY_KEYS[mob.family]        <- family fallback
     'mob_bandit'                   <- default fallback
  -> VISUALS[visualKey]             -> VisualDef { url, height, clips, tint, ... }
  -> GLB loaded from public/        -> rendered on screen
```

Your fork adds two exports from `src/render/characters/custom/index.ts`:
- `CUSTOM_MOB_KEYS` -- merged LAST into `MOB_KEYS`, so your entries win
- `CUSTOM_VISUALS` -- merged LAST into `VISUALS`, so your entries win

Winning last means: if you add `wolf: 'custom_wolf'` to `CUSTOM_MOB_KEYS`, every
wolf in the game will use your model instead of the upstream one. No upstream file
needs to be edited.

---

## Part 1 -- Overriding an existing creature

### Step 1 -- Identify the template ID

Find the upstream mob's template ID in `src/sim/content/` (e.g. `zone1.ts`,
`zone2.ts`, `dungeons.ts`, `warlock_pets.ts`).

Examples of template IDs:

| What you see in game | Template ID |
|---|---|
| Timber Wolf | `wolf` |
| Kobold Laborer | `kobold_laborer` |
| Warlock Imp pet | `imp` |
| Warlock Felhunter | `felhunter` |
| Warlock Infernal | `infernal` |

You can also search the codebase:
```bash
grep -r "templateId\|^  [a-z_]*:" src/sim/content/ | grep -v "//"
```

### Step 2 -- Decide what you want to change

**Option A -- Change only the color/scale/tint (no new GLB needed)**

The entity's `color` (hex int on the mob template in content files) and `scale`
fields are applied at runtime. A `tint: 'entity'` visual blends that color onto
the material. You can change how strongly the tint applies:

```typescript
// In src/render/characters/custom/index.ts
export const CUSTOM_VISUALS: Record<string, VisualDef> = {
  custom_imp: {
    url: 'models/creatures/demonalt.glb',  // same upstream GLB
    height: 1.2,
    clips: BIPED14,
    tint: 'entity',
    tintStrength: 0.9,  // stronger color, more distinct from other demons
  },
};

export const CUSTOM_MOB_KEYS: Record<string, string> = {
  imp: 'custom_imp',
};
```

**Option B -- Swap the GLB model**

Drop a new GLB in `public/models/creatures/custom/` and point the visual at it.

**Option C -- Change the size only**

The mob template's `scale` field in `src/sim/content/custom/index.ts` (or
upstream content) controls world-space size. Change it there if you own the mob.
For upstream mobs you cannot edit the scale without touching an upstream file --
use a new visual key with a different `height` value instead.

### Step 3 -- Add a custom visual key (if using a new model or new tint config)

Open `src/render/characters/custom/index.ts` and add to `CUSTOM_VISUALS`:

```typescript
export const CUSTOM_VISUALS: Record<string, VisualDef> = {
  custom_felhunter: {
    url: 'models/creatures/custom/felhunter.glb',  // your GLB
    height: 1.6,
    clips: animal(['Attack']),  // Quaternius 4-legged rig
    tint: 'entity',
    tintStrength: 0.5,
  },
};
```

If you want to reuse an existing upstream GLB (no new model file), use the exact
path from the upstream visual definition:

```typescript
  custom_felhunter: {
    url: 'models/creatures/demonalt.glb',  // reuse upstream GLB
    height: 1.6,
    clips: BIPED14,
    tint: 'entity',
    tintStrength: 0.8,
  },
```

To use ClipMap factories, import them from the manifest:

```typescript
import type { VisualDef } from '../manifest';
// For BIPED14 and FLOATING (pre-built ClipMap objects):
import { BIPED14, FLOATING } from '../manifest';
// For factory functions (build a ClipMap with custom clip names):
import { animal, kaykit, skeletonClips } from '../manifest';
```

Note: `BIPED14`, `FLOATING`, `animal`, `kaykit`, and `skeletonClips` need to be
exported from `manifest.ts` if they are not already. Check by searching:
```bash
grep -n "^export const BIPED14\|^export function animal\|^export function kaykit" \
  src/render/characters/manifest.ts
```

If they are not exported, the simplest approach is to duplicate the ClipMap
inline in your VisualDef (see the ClipMap reference at the end of this doc).

### Step 4 -- Wire the template ID to your visual key

Add to `CUSTOM_MOB_KEYS` in `src/render/characters/custom/index.ts`:

```typescript
export const CUSTOM_MOB_KEYS: Record<string, string> = {
  felhunter: 'custom_felhunter',
};
```

Because `CUSTOM_MOB_KEYS` is spread last into the upstream `MOB_KEYS`, this
overrides the upstream entry (or fills in a missing one) for every felhunter.

### Step 5 -- Run the type check and tests

```bash
npx tsc --noEmit
npm test
```

No new tests are required for visual changes -- the architecture test
(`tests/architecture.test.ts`) confirms no bad imports, and the build gate
below confirms the new GLB path resolves correctly.

### Step 6 -- Rebuild the media manifest

The media manifest (`src/render/assets/manifest.generated.ts`) maps logical
paths to content-hashed `/media/...` URLs. Run:

```bash
npm run build
```

After building, verify your GLB appears in the manifest:

```bash
grep "creatures/custom" src/render/assets/manifest.generated.ts
```

You should see a line like:
```
"models/creatures/custom/felhunter.glb": "/media/models/creatures/custom/felhunter.abc123.glb",
```

---

## Part 2 -- Adding a new creature from a CC0 pack

### Step 1 -- Get the GLB file

The game uses two CC0 asset sources. Get files from either:

**Quaternius CC0 creature packs** (recommended for beasts, monsters)
- Website: https://quaternius.com/packs/ultimateanimals.html
- Also: https://quaternius.com/packs/ultimatefantasycharacters.html
- License: CC0 (public domain, no attribution required)
- Rig type: 4-legged animals use the `animal()` ClipMap; humanoids use a
  custom biped you will need to inspect for clip names

**KayKit asset packs** (recommended for humanoid characters, undead, skeletons)
- Website: https://kaylousberg.itch.io/
- License: CC0 (check each pack -- most are CC0)
- Rig type: KayKit humanoid uses `kaykit()`; skeleton characters use `skeletonClips()`
- The game already uses: Adventurers pack (player characters), Dungeon pack
  (skeleton enemies), NPC pack (village NPCs)

**Sketchfab CC0 models**
- Website: https://sketchfab.com/3d-models?features=downloadable&license=cc0
- Filter by CC0 license; download GLB format
- Rig type: varies -- inspect the GLB in Blender or https://gltf.report to find
  animation clip names

**Custom Blender models**
- Export as GLB (File > Export > glTF 2.0, select Binary .glb)
- Include animations via Mixamo (https://www.mixamo.com) or hand-authored
- See the Rig Compatibility section below for clip name requirements

### Step 2 -- Inspect the GLB animation clips

Before wiring the model, you need to know what animation clip names are baked in.
The easiest way:

**Option A -- Online inspector (fastest)**
Upload the GLB to https://gltf.report -- it lists all animations with their names.

**Option B -- Blender**
Open Blender, import the GLB (File > Import > glTF 2.0), open the Dope Sheet in
Animation mode. All actions/clips are listed there.

**Option C -- Three.js log in the browser console**
After wiring the model (steps below), open the browser console and look for a
`prepareVisual` log that lists the available clips. The renderer logs a warning
when a required clip is missing.

Make a note of the clip names for: idle, walk, run, at least one attack, and death.

### Step 3 -- Place the GLB file

Drop the GLB into:
```
public/models/creatures/custom/your_model_name.glb
```

Keep the filename lowercase with underscores, no spaces. The build pipeline
auto-discovers everything in `public/` recursively.

### Step 4 -- Add a sim content entry (if adding a new mob type)

If this is a brand-new mob (not replacing an existing one), you also need a mob
template in the sim. Follow `docs/custom-content/ADDING-CUSTOM-CONTENT.md` for
the sim side. The template ID you choose there is what you wire in `CUSTOM_MOB_KEYS`.

If you are only changing the visual for an existing upstream mob, skip this step.

### Step 5 -- Define the VisualDef

Open `src/render/characters/custom/index.ts` and add to `CUSTOM_VISUALS`.

**For a Quaternius 4-legged beast:**
```typescript
custom_forest_bear: {
  url: 'models/creatures/custom/forest_bear.glb',
  height: 2.2,       // world-unit height from pivot to crown at scale=1
  clips: {
    idle:   'Idle',        // exact clip name from the GLB
    walk:   'Walk',
    run:    'Gallop',      // Quaternius uses 'Gallop' for run
    attack: ['Attack'],    // array -- the renderer rotates through them
    death:  'Death',
    hit:    ['Hit_A'],     // optional -- remove if the GLB has none
  },
  tint: 'entity',
  tintStrength: 0.3,
},
```

**For a KayKit humanoid:**
```typescript
custom_dark_elf: {
  url: 'models/creatures/custom/dark_elf.glb',
  height: 1.85,
  clips: {
    idle:   'Idle',
    walk:   'Walking_A',       // KayKit convention
    run:    'Running_A',
    attack: ['1H_Melee_Attack_Chop', '1H_Melee_Attack_Slice_Diagonal'],
    death:  'Death',
    hit:    ['Hit_A', 'Hit_B'],
    cast:   'Spellcast_Long',  // optional -- only if the GLB has one
  },
  show: ['Hair', 'Helmet'],    // KayKit chars ship every accessory; allowlist what to keep
  attach: [{ url: 'models/weapons/sword_1handed.glb', bone: 'handslot.r' }],
  weaponSlots: [0],
},
```

**For a hovering/flying creature:**
```typescript
custom_void_wyrm: {
  url: 'models/creatures/custom/void_wyrm.glb',
  height: 1.5,
  hover: 0.4,  // mesh bottom floats this many units above the pivot
  clips: {
    idle:   'Float',
    walk:   'Float',
    run:    'Fly',
    attack: ['Bite'],
    death:  'Death',
  },
  tint: 'entity',
  tintStrength: 0.4,
},
```

### Step 6 -- Wire the template ID

Add to `CUSTOM_MOB_KEYS`:
```typescript
export const CUSTOM_MOB_KEYS: Record<string, string> = {
  custom_forest_bear_mob: 'custom_forest_bear',
  custom_dark_elf_rogue:  'custom_dark_elf',
};
```

The key on the left is the mob `templateId` from the sim content; the value on
the right is the visual key you defined in `CUSTOM_VISUALS`.

### Step 7 -- Build and verify

```bash
npm run build
grep "creatures/custom/forest_bear" src/render/assets/manifest.generated.ts
```

Then test in the browser: spawn the mob and confirm the model appears, animates,
and does not produce console errors about missing clips.

---

## VisualDef field reference

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Path to the GLB file, relative to `public/` |
| `height` | `number` | Yes | World-unit height from pivot to crown at scale=1 |
| `clips` | `ClipMap` | Yes | Animation clip name mapping (see below) |
| `animUrls` | `string[]` | No | Extra GLBs that provide additional animation clips |
| `hover` | `number` | No | For floating rigs: mesh bottom offset above pivot |
| `yaw` | `number` | No | Rotation (radians) to make the model face +Z direction |
| `show` | `string[]` | No | KayKit only: non-skinned mesh node names to keep visible |
| `attach` | `AttachDef[]` | No | Weapon/prop GLBs attached to a bone |
| `weaponSlots` | `number[]` | No | Which `attach` indices swap with equipped weapon |
| `tint` | `number \| 'entity'` | No | Fixed hex color, or `'entity'` to use mob's own color |
| `tintStrength` | `number` | No | 0-1 lerp toward tint (default 0.4) |
| `walkRef` | `number` | No | Walk cycle speed reference for foot-speed matching |
| `runRef` | `number` | No | Run cycle speed reference for foot-speed matching |
| `attackTimeScale` | `number` | No | Scales attack animation playback speed |
| `deathTimeScale` | `number` | No | Scales death animation playback speed |
| `lazyPreload` | `boolean` | No | Skip boot preload; load on first use |
| `weaponFix` | `object[]` | No | Post-load node rotation fixes for grip orientation |

## ClipMap field reference

| Field | Required | Description |
|---|---|---|
| `idle` | Yes | Looping idle/stand pose |
| `walk` | Yes | Looping walk cycle |
| `run` | Yes | Looping run cycle |
| `attack` | Yes | Array of one-shot attack clips (rotated per swing) |
| `death` | Yes | One-shot death animation |
| `hit` | No | Array of one-shot hit-react clips |
| `cast` | No | Looping spell-cast channel animation |
| `swim` | No | Looping swim base pose |
| `jump` | No | Airborne base pose while jumping/falling |
| `walkBack` | No | Looping backwards walk |
| `flourish` | No | One-shot played on respawn |
| `sitDown` | No | Sit-down one-shot |
| `sitIdle` | No | Looping idle while seated |
| `emote` | No | Overhead emote clip map |

The renderer falls back gracefully when optional clips are missing -- it will not
crash, but the animation will snap to idle instead of playing the missing clip.

---

## Warlock pet quick-reference

All 7 warlock pets are pre-wired in `CUSTOM_MOB_KEYS` with their own entries.
To give a pet a unique model, add a CUSTOM_VISUALS entry and update the
CUSTOM_MOB_KEYS value for that pet to point to it:

| Pet | Template ID | Current visual | Change to |
|---|---|---|---|
| Imp | `imp` | `mob_demon` (demonalt.glb) | Add `custom_imp` + new GLB |
| Voidwalker | `voidwalker` | `mob_demon` (demonalt.glb) | Add `custom_voidwalker` + new GLB |
| Succubus | `succubus` | `mob_demon` (demonalt.glb) | Add `custom_succubus` + new GLB |
| Warlock Imp | `warlock_imp` | `mob_demon_flying` (demon.glb) | Add `custom_warlock_imp` + new GLB |
| Warlock Voidwalker | `warlock_voidwalker` | `mob_demonalt` (demonalt.glb) | Add `custom_warlock_voidwalker` + new GLB |
| Felhunter | `felhunter` | `mob_demonalt` (demonalt.glb) | Add `custom_felhunter` + new GLB |
| Felguard | `felguard` | `mob_demonalt` (demonalt.glb) | Add `custom_felguard` + new GLB |
| Infernal | `infernal` | `mob_demonalt` (demonalt.glb) | Add `custom_infernal` + new GLB |
| Doomguard | `doomguard` | `mob_demonalt` (demonalt.glb) | Add `custom_doomguard` + new GLB |

---

## Rig compatibility cheat sheet

| Rig source | ClipMap to use | Notes |
|---|---|---|
| Quaternius Ultimate Animals | `{ idle: 'Idle', walk: 'Walk', run: 'Gallop', attack: ['Attack'], death: 'Death' }` | 4-legged rigs |
| Quaternius Fantasy Characters | `{ idle: 'Idle', walk: 'Walk', run: 'Run', attack: ['Melee_Attack'], death: 'Death' }` | Humanoid; clip names may vary |
| KayKit Adventurers (humanoid) | `kaykit(['1H_Melee_Attack_Chop'])` | Must import `kaykit` from manifest |
| KayKit Dungeon (skeleton) | `skeletonClips(['1H_Melee_Attack_Chop'])` | Must import `skeletonClips` from manifest |
| Mixamo-rigged (humanoid) | Custom ClipMap with Mixamo names | clip names: `idle`, `walk`, `run`, `attack`, `death` (check in Blender) |
| 14-bone biped (upstream demons) | `BIPED14` | Must import `BIPED14` from manifest |
| Upstream floating | `FLOATING` | Must import `FLOATING` from manifest |

To import the upstream ClipMap factories in `custom/index.ts`:
```typescript
// Check which are exported before using:
// grep -n "^export" src/render/characters/manifest.ts | grep -i "biped\|float\|animal\|kaykit\|skel"
import { BIPED14, FLOATING, animal, kaykit, skeletonClips } from '../manifest';
```

---

## Asset license notes

If you use assets from external packs, confirm the license before shipping:
- Quaternius packs: CC0 public domain -- no attribution, commercial use OK
- KayKit packs: check each pack's itch.io page; most are CC0
- Sketchfab: filter by CC0 on the download page; attribution sometimes requested
- Mixamo animations: free to use in commercial projects (Adobe Mixamo terms)

Keep a record of which GLB files came from which pack in case you need to verify
a license later.

---

## Upstream merge recovery

After any upstream merge, verify the hook survived:

```bash
grep -n "CUSTOM_MOB_KEYS\|CUSTOM_VISUALS" src/render/characters/manifest.ts
```

Expected output (3 hits):
```
7:import { CUSTOM_MOB_KEYS, CUSTOM_VISUALS } from './custom';
819:  ...CUSTOM_VISUALS,
874:  ...CUSTOM_MOB_KEYS,
```

Line numbers will drift as upstream adds content, but you should see exactly
these three patterns. If any are missing, re-apply from `docs/MAINTAINING-FORK.md`
under the "manifest.ts -- custom visual hook" section.
