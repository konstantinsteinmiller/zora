import NPC from '@/entity/NPC.ts'
import type { Guild } from '@/types/entity.ts'
import $ from '@/global'

export default (config: any = {}) => {
  const entity = NPC({
    id: 'none_kid',
    model: 'none-kid.fbx',
    stats: { name: 'Kid' },
    guild: 'GLD_NONE' as Guild,
    ...config,
  })
  entity.routines = {
    start: {
      wp: 'WP_CEL_FRIEND_START',
      callback: (entity: any) => {
        // console.log('entity: ', entity)
        entity.mesh.lookAt($.trainer.mesh.position.x, entity.position.y, $.trainer.mesh.position.z)
      },
    },
  }
  return entity
}
