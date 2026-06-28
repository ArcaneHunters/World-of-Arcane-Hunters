import type { NpcDef } from '../../../types';

export const DRAGONS_BLIGHT_NPCS: Record<string, NpcDef> = {

  // Commander Vael: the grizzled officer who holds Blightwatch Post together.
  // Quest giver for quests 1, 2, and the ambient patrol quest.
  custom_commander_vael: {
    id: 'custom_commander_vael',
    name: 'Commander Vael',
    title: 'Blightwatch Officer',
    pos: { x: 0, z: 962 },
    facing: Math.PI,
    color: 0x7A6A50,
    questIds: ['custom_proving_ground', 'custom_marks_of_the_drake', 'custom_blight_patrol'],
    greeting: 'Stand ready, $N. This blight does not sleep, and neither do we.',
  },

  // Scout Fenris: advance scout stationed in the deeper Blight, past the wyvern nests.
  // Quest giver for quests 3 and 4.
  custom_scout_fenris: {
    id: 'custom_scout_fenris',
    name: 'Scout Fenris',
    title: 'Blightwatch Scout',
    pos: { x: -25, z: 1080 },
    facing: 0,
    color: 0x556644,
    questIds: ['custom_into_the_blight', 'custom_eye_of_the_storm'],
    greeting: 'You made it through the wyvern grounds? Good. I could use someone capable out here.',
  },

  // Elder Draxis: a veteran dragonslayer who served before the Post was built.
  // Quest giver for quest 5 (the dungeon quest) and vendor for basic supplies.
  custom_elder_draxis: {
    id: 'custom_elder_draxis',
    name: 'Elder Draxis',
    title: 'Dragonslayer',
    pos: { x: 12, z: 958 },
    facing: Math.PI,
    color: 0x886655,
    questIds: ['custom_eternal_flame'],
    vendorItems: ['healing_potion', 'mana_potion'],
    greeting: 'I have hunted dragons for thirty years, $N. Ignaraxis is not like the others.',
  },
};
