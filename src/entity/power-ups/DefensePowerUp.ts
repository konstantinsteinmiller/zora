import Collidable from '@/entity/power-ups/CollidableItem.ts'
import state, { getEntity } from '@/states/GlobalState.ts'
import { startShimmeringSphere } from '@/vfx/shimmering-sphere.ts'
import { Vector3 } from 'three'

export default () => {
  const position = new Vector3(10.56, -2.1, 6)
  const vfx = startShimmeringSphere(position)

  const powerUp = Collidable({
    name: 'defense-power-up',
    meshPath: 'models/power-ups/breast_plate.comp.glb',
    size: 0.4,
    onCollisionStart: (colliderA, colliderB, uuid, entity) => {
      // console.log('Collision started between Defense Power Up and:')

      if (entity) {
        entity.defense.buff = {
          ...entity.defense.buff,
          value: 0.5,
          duration: 30000,
          endTime: Date.now() + 30000,
        }
        console.log('entity.currentSpell.buff: ', entity.defense.buff.value, entity.defense.buff.duration)
      }
      /* on collide buff logic */

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

  return powerUp
}
