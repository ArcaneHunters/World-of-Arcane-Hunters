// Fork-owned creature visual overrides and new creature definitions.
// This file is never touched by upstream merges.
//
// CUSTOM_MOB_KEYS  -- overrides or additions to the MOB_KEYS dispatch table
//                     (templateId -> visual key). Entries here win over upstream.
// CUSTOM_VISUALS   -- new VisualDef entries (visual key -> GLB + animation config).
//                     Can also shadow an upstream key to replace its model entirely.
//
// Both are spread LAST into manifest.ts so custom entries always take precedence.
// See docs/custom-content/CREATURE-MODELS.md for the full authoring guide.

import type { VisualDef } from '../manifest';

// Base path for GLBs placed in this fork's exclusive model directory.
// Drop .glb files into public/models/creatures/custom/ and reference them as:
//   `${CUSTOM_CREATURES}/mymodel.glb`
const CUSTOM_CREATURES = 'models/creatures/custom';

// ---------------------------------------------------------------------------
// CUSTOM_MOB_KEYS
//
// Maps mob template IDs to visual keys. Entries here are merged LAST into the
// upstream MOB_KEYS table, so they override any upstream mapping for that id.
//
// Use this to:
//   - Give a specific mob a unique model (override a family fallback)
//   - Redirect an upstream creature to a custom visual key
//   - Give each warlock pet its own distinct model/appearance
//
// Format:
//   templateId: 'visual_key',
//
// The visual key must exist in either the upstream VISUALS or CUSTOM_VISUALS below.
// ---------------------------------------------------------------------------

export const CUSTOM_MOB_KEYS: Record<string, string> = {
  // Warlock pets: give each a distinct visual key so they can have unique
  // models, scales, and tints rather than all sharing mob_demonalt.
  // Currently mapped to existing upstream visual keys (same models,
  // but now individually controllable). Swap the visual key to a
  // CUSTOM_VISUALS entry below when you add a unique GLB for each pet.
  felhunter:  'mob_demonalt',
  felguard:   'mob_demonalt',
  infernal:   'mob_demonalt',
  doomguard:  'mob_demonalt',

  // Example -- override wolf to use a custom model when you have one:
  // timber_wolf: 'custom_timber_wolf',
};

// ---------------------------------------------------------------------------
// CUSTOM_VISUALS
//
// Defines new visual keys (or shadows upstream keys) with GLB + animation config.
// Spread LAST into manifest.ts VISUALS, so a key here silently replaces any
// upstream entry with the same name.
//
// Required fields: url, height, clips
// Use an existing upstream ClipMap factory for compatible rigs:
//   animal(['Attack'])         -- Quaternius 4-legged beasts
//   BIPED14                   -- 14-bone humanoid biped (demons, orcs, etc.)
//   FLOATING                  -- hovering/flying creatures
//   kaykit(['ClipName'])       -- KayKit humanoid characters
//   skeletonClips(['ClipName'])-- KayKit skeleton warriors/mages/rogues
//
// See docs/custom-content/CREATURE-MODELS.md for field reference and examples.
// ---------------------------------------------------------------------------

export const CUSTOM_VISUALS: Record<string, VisualDef> = {
  // Example -- new creature from a Quaternius pack:
  // custom_forest_bear: {
  //   url: `${CUSTOM_CREATURES}/forest_bear.glb`,
  //   height: 2.2,
  //   clips: animal(['Attack']),
  //   tint: 'entity',
  //   tintStrength: 0.3,
  // },

  // Example -- warlock felhunter with a unique model:
  // custom_felhunter: {
  //   url: `${CUSTOM_CREATURES}/felhunter.glb`,
  //   height: 1.4,
  //   clips: animal(['Attack']),
  //   tint: 'entity',
  //   tintStrength: 0.5,
  // },
};
