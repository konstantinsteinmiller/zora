import state from '@/states/GlobalState.ts'
import Rapier, { Capsule, Collider, QueryFilterFlags, RigidBody } from '@dimforge/rapier3d-compat'
import { Mesh, Vector3 } from 'three'

interface Entity {
  mesh: Mesh
  rigidBody: RigidBody
  collider: Collider
  halfHeight: number
  colliderRadius: number
}

interface CollisionResult {
  position: Vector3
  normal: Vector3
  toi: number
}

const MAX_SLOPE_ANGLE = Math.PI / 4 // 45 degrees
const STEP_HEIGHT = 0.3
const GRAVITY = new Vector3(0, -9.81, 0)
const MAX_FALL_SPEED = 50

export const calcDesiredMovement = (entity: Entity, velocity: Vector3, deltaS: number): Vector3 => {
  // Calculate movement directions based on the character's orientation
  const meshQuat = entity.mesh.quaternion
  const forward = new Vector3(0, 0, 1)
    .applyQuaternion(meshQuat)
    .normalize()
    .multiplyScalar(velocity.z * deltaS)
  const sideways = new Vector3(1, 0, 0)
    .applyQuaternion(meshQuat)
    .normalize()
    .multiplyScalar(velocity.x * deltaS)

  // Desired movement vector
  const desiredMovement = new Vector3().addVectors(forward, sideways)
  return desiredMovement
}

export function detectCollisions(entity: Entity, deltaTime: number, desiredMovement: Vector3): void {
  const position = entity.mesh.position.clone()
  const velocity = desiredMovement.clone()
  let isGrounded = false

  // Cast shape downward to detect ground
  const groundHit = castCapsule(position, new Vector3(0, -1, 0), STEP_HEIGHT + 0.1, entity)

  if (groundHit && groundHit.normal.y > Math.cos(MAX_SLOPE_ANGLE)) {
    isGrounded = true
    const dist = STEP_HEIGHT - groundHit.toi
    if (dist > 0.0) {
      position.y += STEP_HEIGHT - groundHit.toi + entity.halfHeight * 0.8
    }
  } else {
    // Apply gravity if not grounded
    velocity.add(GRAVITY.clone().multiplyScalar(deltaTime))
    if (velocity.length() > MAX_FALL_SPEED) {
      velocity.setLength(MAX_FALL_SPEED)
    }
  }

  // Horizontal movement
  const horizontalVelocity = new Vector3(velocity.x, 0, velocity.z)
  if (horizontalVelocity.length() > 0) {
    const horizontalHit = castCapsule(position, horizontalVelocity.clone().normalize(), horizontalVelocity.length() * deltaTime, entity)

    if (horizontalHit) {
      // Slide along the wall
      const slideDirection = horizontalVelocity.clone().sub(horizontalHit.normal.clone().multiplyScalar(horizontalVelocity.dot(horizontalHit.normal)))
      position.add(slideDirection.multiplyScalar(deltaTime))
    } else {
      position.add(horizontalVelocity.multiplyScalar(deltaTime))
    }
  }

  // Update entity position
  entity.mesh.position.copy(position)
  entity.rigidBody.setNextKinematicTranslation(new Rapier.Vector3(position.x, position.y, position.z))
  console.log('isGrounded: ', isGrounded)
}

function castCapsule(position: Vector3, direction: Vector3, distance: number, entity: Entity): CollisionResult | null {
  const filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC
  const filterGroups = 0x000b0001

  const shapePos = new Rapier.Vector3(position.x, position.y + entity.halfHeight, position.z)
  const shapeRot = new Rapier.Quaternion(0, 0, 0, 1) // Assuming no rotation
  const shapeVel = new Rapier.Vector3(direction.x * distance, direction.y * distance, direction.z * distance)
  const shape = new Capsule(entity.halfHeight, entity.colliderRadius) // Assuming the collider has a shape property

  const hit = state.physics.castShape(
    shapePos,
    shapeRot,
    shapeVel,
    shape,
    distance,
    1.0, // maxToi
    true, // stopAtPenetration
    filterFlags, // filterFlags
    filterGroups, // filterGroups
    entity.collider, // filterExcludeCollider
    entity.rigidBody // filterExcludeRigidBody
  )

  console.log('hit: ', hit)
  if (hit) {
    return {
      position: new Vector3(hit.witness1.x, hit.witness1.y, hit.witness1.z),
      normal: new Vector3(hit.normal1.x, hit.normal1.y, hit.normal1.z),
      toi: hit.time_of_impact,
    }
  }

  return null
}
