import $ from '@/global'
import Rapier, { Capsule, QueryFilterFlags } from '@dimforge/rapier3d-compat'
import { ArrowHelper, Vector3 } from 'three'

const calcUpVector = (entity: any, deltaS: number) => {
  const isFlying = entity.stateMachine.currentState.name === 'fly'
  let flyImpulse = entity.appliedFlyImpulse

  if (!isFlying || flyImpulse <= 0) {
    return 0
  }

  const decayFactor = Math.exp(-1 * deltaS) // Exponential decay
  flyImpulse *= decayFactor
  entity.appliedFlyImpulse = flyImpulse
  return flyImpulse
}

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
  const directionUp: any = calcUpVector(entity, deltaS)

  const direction: Vector3 = new Vector3(forward.x + sideways.x, directionUp, forward.z + sideways.z)
  const directionN: Vector3 = direction.clone().normalize()

  const movementVector = new Rapier.Vector3(direction.x, direction.y, direction.z)
  movementVector.x += rigidPos.x
  movementVector.y += rigidPos.y
  movementVector.z += rigidPos.z
  if ($.enableDebug) {
    const arrowHelper = new ArrowHelper(directionN, rigidPos, 2, 0xff1100, 0.6, 0.3)
    $.scene.add(arrowHelper)
    setTimeout(() => {
      $.scene.remove(arrowHelper)
    }, 5)
  }

  /* shape cast into movementVector direction to find obstacles */
  const shapePos = { x: movementVector.x, y: movementVector.y + entity.halfHeight, z: movementVector.z }
  const shapeRot = entity.rigidBody.rotation()
  const shapeVel = new Vector3(forward.x + sideways.x, 0, forward.z + sideways.z)
  const movementMagnitude = shapeVel.length() // Preserve movement magnitude
  shapeVel.normalize()

  const shape = new Capsule(0.7, 0.4)
  const targetDistance = 0.0
  const maxToi = 0.1
  const stopAtPenetration = true
  const filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC
  const filterGroups = 0x000b0001
  const filterExcludeCollider = entity.collider
  const filterExcludeRigidBody = entity.rigidBody

  let attemptedMovement = false
  let beforeCorrection = new Vector3(0, 0, 0)
  let pushOut = new Vector3(0, 0, 0)
  // 🟣 Wall Collision & Sliding Fix
  let adjustedWallHit = null
  const wallHit = $.physics.castShape(
    shapePos,
    shapeRot,
    shapeVel,
    shape,
    targetDistance,
    maxToi,
    stopAtPenetration,
    filterFlags,
    filterGroups,
    filterExcludeCollider,
    filterExcludeRigidBody
  )
  if (wallHit) {
    const normal = new Vector3(wallHit.normal1.x, 0, wallHit.normal1.z).normalize()

    // 🟣 Detect if player attempted movement
    pushOut = normal.clone().multiplyScalar(0.01) // Stronger push out
    // 🟣 Project movement onto wall plane (existing logic)
    const movementDir = new Vector3(movementVector.x - rigidPos.x, 0, movementVector.z - rigidPos.z)
    const dotProduct = movementDir.dot(normal)
    const projectedMovement = movementDir.clone().sub(normal.clone().multiplyScalar(dotProduct))
    projectedMovement.setLength(movementDir.length()).multiplyScalar(0.3)

    movementVector.x = rigidPos.x + projectedMovement.x
    movementVector.z = rigidPos.z + projectedMovement.z
    beforeCorrection = new Vector3(movementVector.x, movementVector.y, movementVector.z)
    attemptedMovement = beforeCorrection.lengthSq() > 0.001 // Only if movement input was given

    // Re-check if adjusted movement still collides
    adjustedWallHit = $.physics.castShape(
      shapePos,
      shapeRot,
      projectedMovement,
      shape,
      0.0,
      maxToi,
      stopAtPenetration,
      filterFlags,
      filterGroups,
      filterExcludeCollider,
      filterExcludeRigidBody
    )
    if (adjustedWallHit) {
      movementVector.x = rigidPos.x
      movementVector.z = rigidPos.z
    }
  }

  // 🟣 Gravity & Ground Detection
  const groundHitShape = new Capsule(0.01, 0.1)
  const groundHitVector = new Rapier.Vector3(0, -0.95, 0)
  const groundHitMaxToi = entity.halfHeight
  const groundHit = $.physics.castShape(
    rigidPos,
    shapeRot,
    groundHitVector,
    groundHitShape,
    targetDistance,
    groundHitMaxToi,
    stopAtPenetration,
    filterFlags,
    filterGroups,
    filterExcludeCollider,
    filterExcludeRigidBody
  )
  if (groundHit) {
    entity.isGrounded = true
    entity.utils.groundedTime.value = (Date.now() - entity.utils.groundedTime.lastTimeNotGrounded) / 1000
    const point = groundHit.witness1
    const d = +(rigidPos.y - point.y).toFixed(3)
    if (d < entity.halfHeight - 0.05) {
      const correction = entity.halfHeight - d
      const lerpFactor = 0.3
      movementVector.y += correction * lerpFactor
    }
  } else {
    // 🟣 Apply Gravity and Prevent Sticking in Geometry
    if (entity.utils.takeOffFrames > 0) {
      entity.utils.takeOffFrames--
    } else {
      // Reduced gravity when close to ground to prevent trembling when falling on slopes and hills
      const closeToGroundHit = $.physics.castShape(
        rigidPos,
        shapeRot,
        new Rapier.Vector3(0, -1, 0), // Adjust cast distance
        new Capsule(0.1, 0.1),
        0,
        entity.halfHeight + 0.75, // Adjust maxToi
        stopAtPenetration,
        filterFlags,
        filterGroups,
        filterExcludeCollider,
        filterExcludeRigidBody
      )

      if (closeToGroundHit) {
        const point = closeToGroundHit?.witness1
        const d = +(rigidPos.y - entity.halfHeight - point.y).toFixed(2)
        const gravityFactor = Math.max(0, Math.min(1, d / 0.5)) // Interpolate gravity for smooth falling
        movementVector.y += -4 * deltaS * gravityFactor
      } else {
        movementVector.y += -4 * deltaS
      }
    }
    entity.isGrounded = false
    if (entity.stateMachine.currentState.name === 'fly') {
      entity.utils.groundedTime.lastTimeNotGrounded = Date.now()
      entity.utils.groundedTime.value = 0
    }

    // 🟣 FallHit Detection for Slopes (NEW)
    const fallHitShape = new Capsule(entity.colliderRadius, entity.colliderRadius)
    const fallHitVector = new Rapier.Vector3(0, -0.1, 0)
    const fallHitMaxToi = 0.1
    const fallHit = $.physics.castShape(
      shapePos,
      shapeRot,
      fallHitVector,
      fallHitShape,
      targetDistance,
      fallHitMaxToi,
      stopAtPenetration,
      filterFlags,
      filterGroups,
      filterExcludeCollider,
      filterExcludeRigidBody
    )

    if (fallHit) {
      const normal = new Vector3(fallHit.normal1.x, fallHit.normal1.y, fallHit.normal1.z).normalize()

      pushOut = normal.clone().multiplyScalar(0.01) // Stronger push out

      // 🟣 Determine push-away strength dynamically based on movement direction
      let pushAwayStrength = 0.15
      const movementIntoWall = new Vector3(velocity.x, 0, velocity.z).dot(normal) < 0 // Is the player moving INTO the wall?

      if (movementIntoWall) {
        pushAwayStrength *= 0.1 // Reduce push force if moving into the wall to prevent stuttering
      }

      const pushAway = normal.clone().multiplyScalar(pushAwayStrength)

      // 🟣 Check if we pushed last frame in the same direction
      if (entity.previousPushAway) {
        const sameDirection = entity.previousPushAway.dot(pushAway) > 0 // Is the new push in the same direction?
        if (sameDirection) {
          pushAway.multiplyScalar(1.1) // Slightly increase push force to prevent getting stuck
        } else {
          pushAway.set(0, 0, 0) // Cancel push if it's reversing direction
        }
      }

      // 🟣 Save pushAway for the next frame
      entity.previousPushAway = pushAway.clone()

      // 🟣 Project movement vector onto slope normal while ensuring downward motion
      const movementDir = new Vector3(
        movementVector.x - rigidPos.x,
        movementVector.y - rigidPos.y,
        movementVector.z - rigidPos.z
      )
      const dotProduct = movementDir.dot(normal)
      const projectedMovement = movementDir.clone().sub(normal.clone().multiplyScalar(dotProduct))

      projectedMovement.setLength(movementMagnitude).multiplyScalar(0.3)
      projectedMovement.add(pushAway) // Adds gentle push-off while allowing downward movement

      // Apply projected movement
      movementVector.x = rigidPos.x + projectedMovement.x
      movementVector.y = rigidPos.y + projectedMovement.y - 0.05 // Ensures continuous falling
      movementVector.z = rigidPos.z + projectedMovement.z

      // 🟣 Re-check if adjusted movement still collides
      const adjustedFallHit = $.physics.castShape(
        shapePos,
        shapeRot,
        projectedMovement,
        shape,
        0.0,
        fallHitMaxToi,
        stopAtPenetration,
        filterFlags,
        filterGroups,
        filterExcludeCollider,
        filterExcludeRigidBody
      )
      if (adjustedFallHit) {
        movementVector.x = rigidPos.x
        movementVector.y = rigidPos.y + projectedMovement.y - 0.05
        movementVector.z = rigidPos.z
      }
    }
  }

  // 🟣 Check if movement was canceled
  const movementNullified = beforeCorrection.x === movementVector.x && beforeCorrection.z === movementVector.z
  const didntMove = rigidPos.x === movementVector.x && rigidPos.z === movementVector.z

  if (attemptedMovement && (movementNullified || didntMove)) {
    movementVector.x += pushOut.x
    movementVector.z += pushOut.z
  }

  return movementVector
}
