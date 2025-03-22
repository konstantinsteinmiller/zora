import CollidableItem from '@/entity/power-ups/CollidableItem.ts'
import state from '@/states/GlobalState.ts'
import { startShimmeringSphere } from '@/vfx/shimmering-sphere.ts'
import { Vector3 } from 'three'

export default () => {
  const position = new Vector3(9.5, -2.1, 7)
  const vfx = startShimmeringSphere(position)

  return CollidableItem({
    name: 'attack-power-up',
    meshPath: 'models/power-ups/swords.comp.glb',
    size: 0.4,
    onCollisionStart: (colliderA, colliderB, uuid, entity) => {
      // console.log('Collision started between ATTACK Power Up and:')
      /* on collide buff logic */
      if (entity) {
        entity.currentSpell.buff = {
          ...entity.currentSpell.buff,
          value: 1.5,
          duration: 30000,
          endTime: Date.now() + 30000,
        }
        console.log('entity.currentSpell.buff: ', entity.currentSpell.buff.value, entity.currentSpell.buff.duration)
      }

      /* this is a pickup item, so we remove it here, we might have other logic here later */
      state.triggerEvent('level.object.remove', uuid)
      vfx.emit('cleanup')
    },
    onCollisionEnd: () => {},
    onCleanup: () => {},
    collisionSound: {
      name: 'item',
      options: { volume: 1.2 * 0.25 },
    },
    position,
    rotateMesh: true,
  })
}
