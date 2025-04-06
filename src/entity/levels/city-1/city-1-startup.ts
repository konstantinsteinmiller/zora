import $ from '@/global'
import useOctree from '@/use/useOctree.ts'
import { spawnNpc } from '@/utils/world.ts'

let modelCounter = 0
const npcsList = [
  { id: 'flf_trader', wp: 'WP_flf_trader' },
  { id: 'cel_trainer', wp: 'WP_flf_trade' },
]
export default () => {
  const { buildOctree } = useOctree()

  npcsList.forEach(npc => {
    spawnNpc(npc.id, npc.wp)
  })

  const loadedUuid = $.addEvent('model.loaded', (entity: any) => {
    modelCounter++
    if (modelCounter >= npcsList.length + 1) {
      // buildOctree()
      $.removeEvent('model.loaded', loadedUuid)
    }
  })
}
