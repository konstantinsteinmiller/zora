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
      wp: 'WP_CEL_TRAINER',
      callback: (entity: any) => {
        entity.mesh.lookAt($.player.mesh.position.x, entity.position.y, $.player.mesh.position.z)
      },
    },
  }
  return entity
}
