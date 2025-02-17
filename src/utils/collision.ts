import state from '@/states/GlobalState.ts'
import Rapier, { Capsule, QueryFilterFlags } from '@dimforge/rapier3d-compat'
import { Vector3 } from 'three'

export const calcRapierMovementVector = (entity: any, velocity: Vector3, deltaS: number): Rapier.Vector3 => {
  if (!entity.rigidBody) return new Rapier.Vector3(0, 0, 0)

  const meshQuat: any = entity.mesh.quaternion
  const forward = new Vector3(0, 0, 1)
    .applyQuaternion(meshQuat)
    .normalize()
    .multiplyScalar(velocity.z * deltaS)
  const sideways = new Vector3(1, 0, 0)
    .applyQuaternion(meshQuat)
    .normalize()
    .multiplyScalar(velocity.x * deltaS)

  const rigidPos = entity.rigidBody.translation()

  const movementVector = new Rapier.Vector3(forward.x + sideways.x, 0, forward.z + sideways.z)
  movementVector.x += rigidPos.x
  movementVector.y = rigidPos.y
  movementVector.z += rigidPos.z

  /* shape cast into movementVector direction to find obstacles */
  const shapePos = { x: movementVector.x, y: movementVector.y + entity.halfHeight, z: movementVector.z }
  const shapeRot = entity.rigidBody.rotation()
  const shapeVel = new Vector3(forward.x + sideways.x, 0, forward.z + sideways.z)
  const movementMagnitude = shapeVel.length() // Preserve movement magnitude
  shapeVel.normalize()

  const shape = new Capsule(0.7, 0.4)
  const targetDistance = 0.0
  const maxToi = 0.1
  // Optional parameters:
  const stopAtPenetration = true
  const filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC
  const filterGroups = 0x000b0001
  const filterExcludeCollider = entity.collider
  const filterExcludeRigidBody = entity.rigidBody

  // 🔹 Wall Collision & Sliding Fix
  const adjustedWallHit = null
  const wallHit = state.physics.castShape(shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
  if (wallHit) {
    const normal = new Vector3(wallHit.normal1.x, 0, wallHit.normal1.z).normalize()

    // 🔥 Project movement vector onto the wall plane while preserving magnitude
    const movementDir = new Vector3(movementVector.x - rigidPos.x, 0, movementVector.z - rigidPos.z)
    const dotProduct = movementDir.dot(normal)
    const projectedMovement = movementDir.clone().sub(normal.clone().multiplyScalar(dotProduct))

    projectedMovement.setLength(movementMagnitude).multiplyScalar(0.3) // Ensure movement length stays the same

    // Apply projected movement
    movementVector.x = rigidPos.x + projectedMovement.x
    movementVector.z = rigidPos.z + projectedMovement.z

    // Re-check if adjusted movement still collides
    const adjustedWallHit = state.physics.castShape(shapePos, shapeRot, projectedMovement, shape, 0.0, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
    if (adjustedWallHit) {
      movementVector.x = rigidPos.x
      movementVector.z = rigidPos.z
    }
  }

  // 🔹 Gravity & Ground Detection
  /* implement ray cast down to detect ground and only apply
   * gravity when not grounded */
  entity.isGrounded = false
  const groundHit = state.physics.castShape(rigidPos, shapeRot, new Rapier.Vector3(0, -1, 0), new Capsule(0.01, 0.1), targetDistance, entity.halfHeight, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
  if (groundHit) {
    entity.isGrounded = true
    const point = groundHit.witness1
    const d = +(rigidPos.y - point.y).toFixed(3)
    if (d < entity.halfHeight - 0.05 && !adjustedWallHit) {
      movementVector.y += entity.halfHeight - d
    }
  } else {
    // Apply gravity only if not grounded
    movementVector.y += -4 * deltaS
  }

  return movementVector
}
