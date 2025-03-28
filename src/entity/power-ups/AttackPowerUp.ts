import CollidableItem from '@/entity/power-ups/CollidableItem.ts'
import { startShimmeringSphere } from '@/vfx/shimmering-sphere.ts'
import { Vector3 } from 'three'

export default (position: Vector3) => {
  const vfx = startShimmeringSphere(position)

  const collidable: any = CollidableItem({
    name: 'attack-power-up',
    meshPath: '/models/power-ups/swords.comp.glb',
    size: 0.4,
    onCollisionStart: (colliderA, colliderB, uuid, entity) => {
      /* on collide buff logic */
      if (entity) {
        entity.currentSpell.buff = {
          ...entity.currentSpell.buff,
          value: 1.5,
          duration: 10000,
          endTime: Date.now() + 10000,
        }
        // console.log('entity.currentSpell.buff: ', entity.currentSpell.buff.value, entity.currentSpell.buff.duration)
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
