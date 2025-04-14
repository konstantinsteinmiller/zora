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
      wp: 'WP_flf_trader',
      callback: entity => {
        entity.mesh.lookAt($.trainer.mesh.position.x, entity.position.y, $.trainer.mesh.position.z)
        // console.log('start animation idle: ')
        // entity.playAnimation('idle')
      },
    },
    trade: {
      wp: 'WP_flf_trade',
      callback: (entity: any) => {
        // !window.onceDebugTrade &&
        //   console.log('trade - ', entity.targetPosition.x, entity.targetPosition.y, entity.targetPosition.z)
        // window.onceDebugTrade = true
        // entity.mesh.lookAt($.trainer.mesh.position.x, entity.position.y, $.trainer.mesh.position.z)
        // entity.playAnimation('idle')
      },
    },
  }

  setTimeout(() => {
    entity.setRoutine('trade')
  }, 4000)
  return entity
}
