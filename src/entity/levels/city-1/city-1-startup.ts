import $ from '@/global'
import { spawnNpc } from '@/utils/world.ts'

let modelCounter = 0
const npcsList = [
  { id: 'flf_trader', wp: 'WP_flf_trader' },
  { id: 'cel_trainer', wp: 'WP_flf_trade' },
  { id: 'none_kid', wp: 'WP_CEL_FRIEND_START' },
]

export default () => {
  npcsList.forEach(npc => {
    spawnNpc(npc.id, npc.wp)
  })

  const loadedUuid = $.addEvent('model.loaded', (entity: any) => {
    modelCounter++
    /* + 1 is currently the player loaded in LevelStartup */
    if (modelCounter >= npcsList.length + 1) {
      $.removeEvent('model.loaded', loadedUuid)
    }
  })
}
