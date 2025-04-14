// import $ from '@/global'
import { spawnNpc } from '@/utils/world.ts'

const npcsList = [
  { id: 'flf_trader', wp: 'WP_FLF_TRADER' },
  { id: 'cel_trainer', wp: 'WP_CEL_TRAINER' },
  { id: 'none_kid', wp: 'WP_CEL_FRIEND_START' },
]

export default () => {
  npcsList.forEach(npc => {
    spawnNpc(npc.id, npc.wp)
  })
}
