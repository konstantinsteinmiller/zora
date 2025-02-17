import state from '@/states/GlobalState.ts'
import Rapier, { Capsule, QueryFilterFlags, Ray } from '@dimforge/rapier3d-compat'
import { Vector3 } from 'three'

export const calcRapierMovementVector = (entity: any, velocity: Vector3, deltaS: number): Rapier.Vector3 => {
  const meshQuat: any = entity.mesh.quaternion
  const forward = new Vector3(0, 0, 1)
    .applyQuaternion(meshQuat)
    .normalize()
    .multiplyScalar(velocity.z * deltaS)
  const sideways = new Vector3(1, 0, 0)
    .applyQuaternion(meshQuat)
    .normalize()
    .multiplyScalar(velocity.x * deltaS)

  if (!entity.rigidBody) return

  const direction = new Vector3(forward.x + sideways.x, forward.y + sideways.y, forward.z + sideways.z)
  direction.normalize()
  direction.multiplyScalar(0.1)
  const shortMove = new Rapier.Vector3(direction.x, direction.y, direction.z)

  const rigidPos = entity.rigidBody.translation()
  const movementVector = new Rapier.Vector3(forward.x + sideways.x, forward.y + sideways.y, forward.z + sideways.z)
  movementVector.x += rigidPos.x
  movementVector.y += rigidPos.y
  movementVector.z += rigidPos.z
  shortMove.x += rigidPos.x
  shortMove.y += rigidPos.y
  shortMove.z += rigidPos.z

  let hit = null
  /* shape cast into movementVector direction to find obstacles */
  const shapePos = { x: movementVector.x, y: movementVector.y + entity.halfHeight, z: movementVector.z }
  const shapeRot = entity.rigidBody.rotation()
  const shapeVel = movementVector
  const shape = new Capsule(0.7, 0.4)
  const targetDistance = 0.0
  const maxToi = 0.1
  // Optional parameters:
  const stopAtPenetration = true
  const filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC
  const filterGroups = 0x000b0001
  const filterExcludeCollider = entity.collider
  const filterExcludeRigidBody = entity.rigidBody

  /* implement ray cast down to detect ground and only apply
   * gravity when not grounded */
  movementVector.y += -4 * deltaS
  hit = state.physics.castShape(rigidPos, shapeRot, new Rapier.Vector3(0, -1, 0), new Capsule(0.1, 0.1), targetDistance, entity.halfHeight, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
  if (hit != null) {
    movementVector.y = rigidPos.y
    const point = hit.witness1
    const diff = +(rigidPos.y - (point.y + entity.halfHeight)).toFixed(3)
    if (diff > -0.3 && diff < -0.05) {
      movementVector.y = rigidPos.y - diff
    }
  }

  hit = state.physics.castShape(shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
  if (hit != null) {
    const normal = new Vector3(hit.normal1.x, rigidPos.y, hit.normal1.z).normalize()

    // Project movement onto the surface to allow sliding
    const movementDir = new Vector3(movementVector.x - rigidPos.x,0, movementVector.z - rigidPos.z)
    const dotProduct = movementDir.dot(normal)

    // Remove the component of movement that goes into the wall
    movementDir.sub(normal.multiplyScalar(dotProduct))
    if (dotProduct < 0) {
      // Apply the adjusted movement vector
      movementVector.x = rigidPos.x + movementDir.x
      movementVector.z = rigidPos.z + movementDir.z
      const shapePos = { x: movementVector.x, y: movementVector.y + entity.halfHeight, z: movementVector.z }
      const shapeVel = movementVector
      hit = state.physics.castShape(shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
      if (hit != null) {
        movementVector.x = rigidPos.x
        movementVector.z = rigidPos.z
      }
    }

    // if (previousPos.x === playerPos.x && previousPos.z === playerPos.z) {
    //   console.log('player is stuck: ')
    // }
    // console.log('Hit the collider', hit.collider, 'at time', hit.time_of_impact)
  }
  return movementVector
}
