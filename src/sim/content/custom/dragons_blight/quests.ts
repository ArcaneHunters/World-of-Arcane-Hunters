import type { QuestDef } from '../../../types';

export const DRAGONS_BLIGHT_QUESTS: Record<string, QuestDef> = {

  // Quest 1: Kill 10 ashwalker drakes. Introduces the zone threats.
  custom_proving_ground: {
    id: 'custom_proving_ground',
    name: 'Proving Ground',
    giverNpcId: 'custom_commander_vael',
    turnInNpcId: 'custom_commander_vael',
    text: 'The ashwalker drakes have pushed to the edges of our camp, $N. Thin their numbers -- ten of them -- and prove you belong in the Blight.',
    completionText: 'Ten drakes down. Not bad. You might just survive out here, $N.',
    objectives: [
      { type: 'kill', targetMobId: 'custom_ashwalker_drake', count: 10, label: 'Ashwalker Drakes slain' },
    ],
    xpReward: 3000,
    copperReward: 80,
    itemRewards: {},
    minLevel: 18,
  },

  // Quest 2: Collect 8 drake scales -- materials for dragonslaying gear.
  custom_marks_of_the_drake: {
    id: 'custom_marks_of_the_drake',
    name: 'Marks of the Drake',
    giverNpcId: 'custom_commander_vael',
    turnInNpcId: 'custom_commander_vael',
    text: 'Drake scales are tough as plate, $N. I need eight of them to outfit the next patrol. The drakes do not give them up easily -- take what you can.',
    completionText: 'Eight scales. These will hold up against fire better than anything we can forge. Well done.',
    objectives: [
      { type: 'collect', itemId: 'custom_drake_scale', count: 8, label: 'Ashwalker Drake Scales' },
    ],
    xpReward: 4000,
    copperReward: 100,
    itemRewards: {
      warrior: 'custom_drakebone_shoulders',
      rogue:   'custom_blight_stalkers_hood',
      mage:    'custom_scorchwing_cowl',
    },
    minLevel: 18,
    requiresQuest: 'custom_proving_ground',
  },

  // Quest 3: Kill 8 scorchwing wyverns AND collect 5 wyvern heartstones.
  custom_into_the_blight: {
    id: 'custom_into_the_blight',
    name: 'Into the Blight',
    giverNpcId: 'custom_scout_fenris',
    turnInNpcId: 'custom_scout_fenris',
    text: 'Those scorchwing wyverns are nesting between us and the dungeon, $N. Eight of them need to go, and I need five of their heartstones for the commander\'s alchemist. They\'re deep, but I know you can reach them.',
    completionText: 'The nesting ground is clear. Those heartstones will be worth more to us than you know.',
    objectives: [
      { type: 'kill',    targetMobId: 'custom_scorchwing_wyvern', count: 8, label: 'Scorchwing Wyverns slain' },
      { type: 'collect', itemId: 'custom_wyvern_heartstone',       count: 5, label: 'Scorchwing Heartstones' },
    ],
    xpReward: 5500,
    copperReward: 150,
    itemRewards: {},
    minLevel: 19,
    requiresQuest: 'custom_marks_of_the_drake',
  },

  // Quest 4: Slay 3 blighted sentinels and collect 3 blight embers from them.
  custom_eye_of_the_storm: {
    id: 'custom_eye_of_the_storm',
    name: 'Eye of the Storm',
    giverNpcId: 'custom_scout_fenris',
    turnInNpcId: 'custom_scout_fenris',
    text: 'The blighted sentinels are Ignaraxis\'s outer guard, $N. Ancient dragonkin warped by centuries near that creature. Take down three of them and bring me the blight embers from their cores. If you can manage them, you\'re ready for the maw.',
    completionText: 'Three sentinels down and embers in hand. You\'re ready, $N. Go speak with Elder Draxis back at the post. He has been waiting a long time for this.',
    objectives: [
      { type: 'kill',    targetMobId: 'custom_blighted_sentinel', count: 3, label: 'Blighted Sentinels slain' },
      { type: 'collect', itemId: 'custom_blight_ember',           count: 3, label: 'Blight Embers' },
    ],
    xpReward: 7000,
    copperReward: 200,
    itemRewards: {},
    minLevel: 20,
    requiresQuest: 'custom_into_the_blight',
    suggestedPlayers: 2,
  },

  // Quest 5: Enter Dragon's Maw and slay Ignaraxis. The epic culmination.
  custom_eternal_flame: {
    id: 'custom_eternal_flame',
    name: 'The Eternal Flame',
    giverNpcId: 'custom_elder_draxis',
    turnInNpcId: 'custom_elder_draxis',
    text: 'Ignaraxis the Eternal has slumbered in the Dragon\'s Maw for an age, $N. The Blight above us is his breath given form. Enter the maw, face him in his lair, and end it. Your companions will be necessary -- this is not a hunt for one alone.',
    completionText: 'The Eternal Flame is extinguished, $N. I have waited thirty years to say those words. The Blight will fade now. Take this -- you\'ve more than earned it.',
    objectives: [
      { type: 'kill', targetMobId: 'custom_ignaraxis', count: 1, label: 'Ignaraxis the Eternal slain' },
    ],
    xpReward: 10000,
    copperReward: 600,
    itemRewards: {
      warrior: 'custom_ignaraxis_greatblade',
      rogue:   'custom_fang_of_ignaraxis',
      mage:    'custom_cinderstave_eternal',
    },
    minLevel: 20,
    requiresQuest: 'custom_eye_of_the_storm',
    suggestedPlayers: 3,
  },

  // Ambient patrol quest: available alongside the main chain for extra XP.
  custom_blight_patrol: {
    id: 'custom_blight_patrol',
    name: 'Blight Patrol',
    giverNpcId: 'custom_commander_vael',
    turnInNpcId: 'custom_commander_vael',
    text: 'We cannot let the drakes and wyverns overrun the approaches, $N. Patrol the Blight, cut down fifteen drakes and eight wyverns, and report back. Keeps our flanks clear while the chain of command handles the bigger picture.',
    completionText: 'Flanks are clear. The men breathe easier when someone is out there making a difference. Good work, $N.',
    objectives: [
      { type: 'kill', targetMobId: 'custom_ashwalker_drake',   count: 15, label: 'Ashwalker Drakes slain' },
      { type: 'kill', targetMobId: 'custom_scorchwing_wyvern', count: 8,  label: 'Scorchwing Wyverns slain' },
    ],
    xpReward: 4000,
    copperReward: 250,
    itemRewards: {},
    minLevel: 18,
  },
};

export const DRAGONS_BLIGHT_QUEST_ORDER: string[] = [
  'custom_proving_ground',
  'custom_marks_of_the_drake',
  'custom_blight_patrol',
  'custom_into_the_blight',
  'custom_eye_of_the_storm',
  'custom_eternal_flame',
];
