import CollidableItem from '@/entity/power-ups/CollidableItem.ts'
import state from '@/states/GlobalState.ts'
import { Vector3 } from 'three'

export default () => {
  return CollidableItem({
    name: 'attack-power-up',
    meshPath: 'models/power-ups/swords.comp.glb',
    size: 0.4,
    onCollisionStart: (colliderA, colliderB, uuid) => {
      // console.log('Collision started between ATTACK Power Up and:')
      /* on collide buff logic */

      /* this is a pickup item, so we remove it here, we might have other logic here later */
      state.triggerEvent(`level.object.remove`, uuid)
    },
    onCollisionEnd: () => {},
    onCleanup: () => {},
    position: new Vector3(9.5, -2.1, 7),
    rotateMesh: true,
  })
}
