import NPC from '@/entity/NPC.ts'
import type { Guild } from '@/types/entity.ts'
import $ from '@/global'

export default (config: any = {}) => {
  const entity = NPC({
    id: 'flf_trader',
    model: 'flf-trader.fbx',
    stats: { name: 'flf trader' },
    guild: 'GLD_FLF' as Guild,
    ...config,
  })

  entity.routines = {
    start: {
      wp: 'WP_FLF_TRADER',
      anim: 'run',
      callback: entity => {
        entity.mesh.lookAt($.player.mesh.position.x, entity.position.y, $.player.mesh.position.z)
      },
    },
    trade: {
      wp: 'WP_CEL_TRAINER',
      callback: (entity: any) => {
        // !window.onceDebugTrade &&
        //   console.log('trade - ', entity.targetPosition.x, entity.targetPosition.y, entity.targetPosition.z)
        // window.onceDebugTrade = true
        // entity.mesh.lookAt($.player.mesh.position.x, entity.position.y, $.player.mesh.position.z)
        // entity.playAnimation('idle')
      },
    },
  }

  setTimeout(() => {
    entity.setRoutine('trade')
  }, 3000)
  return entity
}
