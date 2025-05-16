import { spawnNpc } from '@/utils/world.ts'

const npcsList = [
  // {
  //   id: 'flf_trader',
  //   wp: 'WP_FLF_TRADER',
  //   fairiesList: [createFairy(FIRE_DRAGON_OLD.id, 11)],
  // },
  // { id: 'cel_trainer', wp: 'WP_CEL_TRAINER', fairiesList: [createFairy(ICE_YETI_MIDDLE.id, 15)] },
  // { id: 'none_kid', wp: 'WP_CEL_FRIEND_START', fairiesList: [createFairy(ENERGY_FEMALE_OLD.id, 8)] },
]

export default () => {
  npcsList.forEach(npc => {
    spawnNpc(npc)
  })
}
