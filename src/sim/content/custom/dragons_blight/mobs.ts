import type { MobTemplate } from '../../../types';

// ---------------------------------------------------------------------------
// Overworld mobs
// ---------------------------------------------------------------------------

export const DRAGONS_BLIGHT_MOBS: Record<string, MobTemplate> = {

  // Ashwalker Drakes: young fire-touched drakes, common throughout the Blight.
  // L18-19, dragonkin, aggressive but manageable for geared solo players.
  custom_ashwalker_drake: {
    id: 'custom_ashwalker_drake',
    name: 'Ashwalker Drake',
    minLevel: 18, maxLevel: 19,
    family: 'dragonkin',
    hpBase: 62, hpPerLevel: 22,
    dmgBase: 11, dmgPerLevel: 2.4,
    attackSpeed: 1.9,
    armorPerLevel: 16,
    moveSpeed: 8,
    aggroRadius: 11,
    loot: [
      { copper: 85, chance: 1 },
      { itemId: 'custom_drake_scale', chance: 0.65, questId: 'custom_marks_of_the_drake' },
    ],
    scale: 1.15, color: 0x884422,
  },

  // Scorchwing Wyverns: larger, more dangerous cousins. Found deeper in the zone.
  // L19-20, dragonkin, harder hitting. Require more careful pulls.
  custom_scorchwing_wyvern: {
    id: 'custom_scorchwing_wyvern',
    name: 'Scorchwing Wyvern',
    minLevel: 19, maxLevel: 20,
    family: 'dragonkin',
    hpBase: 68, hpPerLevel: 24,
    dmgBase: 12, dmgPerLevel: 2.6,
    attackSpeed: 1.8,
    armorPerLevel: 19,
    moveSpeed: 9,
    aggroRadius: 13,
    loot: [
      { copper: 110, chance: 1 },
      { itemId: 'custom_wyvern_heartstone', chance: 0.55, questId: 'custom_into_the_blight' },
    ],
    scale: 1.25, color: 0xAA3311,
  },

  // Skullfire Brutes: orcish marauders drawn to the Blight by the dragon's call.
  // L18-19, humanoid, solid melee fighters. Patrol the southern blight edge.
  custom_skullfire_brute: {
    id: 'custom_skullfire_brute',
    name: 'Skullfire Brute',
    minLevel: 18, maxLevel: 19,
    family: 'humanoid',
    hpBase: 58, hpPerLevel: 20,
    dmgBase: 11, dmgPerLevel: 2.3,
    attackSpeed: 2.0,
    armorPerLevel: 15,
    moveSpeed: 7,
    aggroRadius: 10,
    loot: [{ copper: 90, chance: 1 }],
    scale: 1.2, color: 0x664422,
  },

  // Blightshroud Stalkers: swift shadow hunters that stalk the deeper Blight.
  // L19-20, humanoid, fast attack speed and high aggro range.
  custom_blightshroud_stalker: {
    id: 'custom_blightshroud_stalker',
    name: 'Blightshroud Stalker',
    minLevel: 19, maxLevel: 20,
    family: 'humanoid',
    hpBase: 48, hpPerLevel: 16,
    dmgBase: 12, dmgPerLevel: 2.4,
    attackSpeed: 1.6,
    armorPerLevel: 14,
    moveSpeed: 9,
    aggroRadius: 14,
    loot: [{ copper: 105, chance: 1 }],
    scale: 0.95, color: 0x222233,
  },

  // Ironpelt Monkroose: a blight-touched bipedal mongoose beast.
  // L18-19, humanoid, quick but not threatening alone. Found in packs.
  custom_ironpelt_monkroose: {
    id: 'custom_ironpelt_monkroose',
    name: 'Ironpelt Monkroose',
    minLevel: 18, maxLevel: 19,
    family: 'humanoid',
    hpBase: 55, hpPerLevel: 19,
    dmgBase: 10, dmgPerLevel: 2.2,
    attackSpeed: 1.8,
    armorPerLevel: 14,
    moveSpeed: 8,
    aggroRadius: 11,
    loot: [{ copper: 80, chance: 1 }],
    scale: 1.05, color: 0x886633,
  },

  // Blighted Sentinels: ancient dragonkin guardians corrupted by Ignaraxis's aura.
  // L20 elite -- intended as a 2-player challenge. Patrol near the dungeon entrance.
  custom_blighted_sentinel: {
    id: 'custom_blighted_sentinel',
    name: 'Blighted Sentinel',
    minLevel: 20, maxLevel: 20,
    family: 'dragonkin',
    elite: true,
    rare: true,
    ccImmune: true,
    respawnMult: 5.0,
    hpBase: 310, hpPerLevel: 0,
    dmgBase: 17, dmgPerLevel: 0,
    attackSpeed: 2.2,
    armorPerLevel: 30,
    moveSpeed: 7,
    aggroRadius: 14,
    aoePulse: { min: 20, max: 28, radius: 7, every: 9, name: 'Blight Breath', school: 'fire' },
    enrage: { belowHpPct: 0.30, dmgMult: 1.45, hasteMult: 1.25 },
    loot: [
      { copper: 240, chance: 1 },
      { itemId: 'custom_blight_ember', chance: 0.70, questId: 'custom_eye_of_the_storm' },
    ],
    scale: 1.5, color: 0x553300,
  },
};

// ---------------------------------------------------------------------------
// Dungeon mobs (Dragon's Maw -- interior only)
// ---------------------------------------------------------------------------

export const DRAGONS_BLIGHT_DUNGEON_MOBS: Record<string, MobTemplate> = {

  // Dragonclaw Wardens: armored dragonkin guards lining the maw's corridors.
  custom_dragonclaw_warden: {
    id: 'custom_dragonclaw_warden',
    name: 'Dragonclaw Warden',
    minLevel: 20, maxLevel: 20,
    family: 'dragonkin',
    elite: true,
    hpBase: 70, hpPerLevel: 25,
    dmgBase: 13, dmgPerLevel: 2.8,
    attackSpeed: 2.0,
    armorPerLevel: 24,
    moveSpeed: 6,
    aggroRadius: 12,
    loot: [
      { copper: 160, chance: 1 },
    ],
    scale: 1.25, color: 0x773322,
  },

  // Ignaraxis the Eternal: ancient fire dragon, the dragon hunt's final quarry. 3-player boss.
  custom_ignaraxis: {
    id: 'custom_ignaraxis',
    name: 'Ignaraxis the Eternal',
    minLevel: 20, maxLevel: 20,
    family: 'dragonkin',
    boss: true,
    elite: true,
    ccImmune: true,
    hpBase: 480, hpPerLevel: 52,
    dmgBase: 16, dmgPerLevel: 3.2,
    attackSpeed: 2.4,
    armorPerLevel: 34,
    moveSpeed: 5,
    aggroRadius: 18,
    aoePulse: { min: 32, max: 46, radius: 14, every: 8, name: 'Eternal Flame', school: 'fire' },
    enrage: { belowHpPct: 0.25, dmgMult: 1.6, hasteMult: 1.4 },
    loot: [
      { copper: 60000, chance: 1 },
      { itemId: 'custom_ignaraxis_greatblade', chance: 0.30 },
      { itemId: 'custom_cinderstave_eternal',  chance: 0.30 },
      { itemId: 'custom_fang_of_ignaraxis',    chance: 0.30 },
    ],
    scale: 1.8, color: 0x992200,
  },
};
