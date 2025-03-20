import Collidable from '@/entity/power-ups/CollidableItem.ts'
import state, { getEntity } from '@/states/GlobalState.ts'
import { Vector3 } from 'three'

export default () => {
  return Collidable({
    name: 'defense-power-up',
    meshPath: 'models/power-ups/breast_plate.comp.glb',
    size: 0.4,
    onCollisionStart: (colliderA, colliderB, uuid) => {
      console.log('Collision started between Defense Power Up and:', colliderB.userData.uuid)
      const entity = getEntity(colliderB.userData.uuid)

      entity.defense.buff = 0.5
      entity.currentSpell.buff = 1.5
      /* on collide buff logic */

      /* this is a pickup item, so we remove it here, we might have other logic here later */
      state.triggerEvent(`level.object.remove`, uuid)
    },
    onCollisionEnd: () => {},
    onCleanup: () => {},
    position: new Vector3(10.5, -2.1, 5),
    rotateMesh: true,
  })
}
