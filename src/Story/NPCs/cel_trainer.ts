import NPC from '@/entity/NPC.ts'
import type { Guild } from '@/types/entity.ts'
import $ from '@/global'

export default (config: any = {}) => {
  const entity = NPC({
    id: 'cel_trainer',
    model: 'friend-trainer.fbx',
    stats: { name: 'Friend Trainer' },
    guild: 'GLD_CEL' as Guild,
    ...config,
  })
  entity.routines = {
    start: {
      wp: 'WP_flf_trade',
      callback: (entity: any) => {
        // console.log('entity: ', entity)
        entity.mesh.lookAt($.trainer.mesh.position.x, entity.position.y, $.trainer.mesh.position.z)
      },
    },
  }
  return entity
}
