import Collidable from '@/entity/power-ups/CollidableItem.ts'
import { startShimmeringSphere } from '@/vfx/shimmering-sphere.ts'
import { Vector3 } from 'three'

export default (position: Vector3) => {
  const vfx = startShimmeringSphere(position)

  const collidable = Collidable({
    name: 'defense-power-up',
    meshPath: '/models/power-ups/breast_plate.comp.glb',
    size: 0.4,
    onCollisionStart: (colliderA, colliderB, uuid, entity) => {
      /* on collide buff logic */
      if (entity) {
        entity.defense.buff = {
          ...entity.defense.buff,
          value: 0.5,
          duration: 10000,
          endTime: Date.now() + 10000,
        }
        // console.log('entity.currentSpell.buff: ', entity.defense.buff.value, entity.defense.buff.duration)
      }

      /* this is a pickup item, so we remove it here, we might have other logic here later */
      collidable.emitter.emit('cleanup')
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

  return collidable
}
