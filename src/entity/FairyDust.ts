import CollidableItem from '@/entity/power-ups/CollidableItem.ts'
import state from '@/states/GlobalState.ts'
import type { Guild } from '@/types/entity.ts'
import { MAX_ROTATION_SPEED, MIN_CHARGE_SPEED } from '@/utils/constants.ts'
import { remap } from '@/utils/function.ts'
import { startFairyDustVFX } from '@/vfx/fairy-dust-vfx.ts'
import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d-compat'
import { Vector3 } from 'three'

const FairyDust = ({ position, onlyInteractableByGuild }: { position: Vector3; onlyInteractableByGuild?: Guild }) => {
  const { vfx, vfxObject }: any = startFairyDustVFX(position)

  const collidable: any = CollidableItem({
    name: 'fairy-dust',
    meshPath: '',
    size: 0.6,
    onCollisionStart: (_colliderA, _colliderB, _uuid, entity) => {
      /* on collide buff logic */
      if (entity) {
        entity.currency.fairyDustCollected += 1
        // console.log('entity.currentSpell.buff: ', entity.currentSpell.buff.value, entity.currentSpell.buff.duration)
      }

      /* this is a pickup item, so we remove it here, we might have other logic here later */
      cleanup()
    },
    onCollisionEnd: () => {},
    onCleanup: () => {},
    colliderType: 'fixed',
    collisionSound: {
      name: 'fairyDust',
      options: { volume: 1.2 * 0.25 },
    },
    position,
    onlyInteractableByGuild,
    rotateMesh: false,
  })

  // Create a Rapier rigid body and collider
  const rigidBodyDesc = RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z)
  rigidBodyDesc
    .setCcdEnabled(true)
    .setLinearDamping(0.95) // Air resistance
    .setAngularDamping(0.9) // Rotational resistance
  collidable.rigidBody = state.physics.createRigidBody(rigidBodyDesc)

  // Create collider with friction
  const colliderDesc = ColliderDesc.ball(0.2).setRestitution(0.5) // Bounciness

  state.physics.createCollider(colliderDesc, collidable.rigidBody)

  // Sync the sprite and VFX position with the rigid body
  const updatePosition = () => {
    if (!vfx || !collidable?.rigidBody.isValid()) return
    const rigidBodyPosition = collidable.rigidBody.translation()
    const newPosition = new Vector3(rigidBodyPosition.x, rigidBodyPosition.y, rigidBodyPosition.z)

    // Update vfx position
    vfxObject.position.copy(newPosition)
  }

  // Add the update function to the render loop
  const updateUuid = state.addEvent('renderer.update', updatePosition)

  const cleanup = () => {
    state.removeEvent('renderer.update', updateUuid)
    vfx.emit('cleanup')
    collidable.emitter.emit('cleanup')
    state.physics.removeRigidBody(collidable.rigidBody)
  }

  collidable.addToLevel(state.level)
  return collidable
}
export default FairyDust

const MAX_FAIRY_DUST_OBJECTS = 7
export function createFairyDustObjects(rotationSpeed: number, position: Vector3) {
  const clampedRotationSpeed = Math.min(Math.max(rotationSpeed, MIN_CHARGE_SPEED), MAX_ROTATION_SPEED)
  const totalObjects = Math.floor(
    remap(MIN_CHARGE_SPEED, MAX_ROTATION_SPEED, 0, MAX_FAIRY_DUST_OBJECTS, clampedRotationSpeed)
  )

  const fairyDustObjects = []
  const spawnRadius = 0.5 // Radius around player to spawn objects
  const FAIRY_DUST_COLLISION_GROUP = 0x00010000 // Custom collision group for fairy dust

  for (let i = 0; i < totalObjects; i++) {
    // Calculate position in a circle around player
    const angle = (i / totalObjects) * Math.PI * 2
    const offsetX = Math.cos(angle) * spawnRadius
    const offsetZ = Math.sin(angle) * spawnRadius
    const spawnHeight = 1.3 + Math.random() * 1.5 // 2-4 units above

    const spawnPosition = position.clone().add(new Vector3(offsetX, spawnHeight, offsetZ))

    const fairyDust = FairyDust({
      position: spawnPosition,
      onlyInteractableByGuild: 'guild-0' as Guild,
    })

    // Configure collision filtering
    // if (fairyDust.rigidBody && fairyDust.collider) {
    //   // Set collision groups (memberships and filters)
    //   // This will make fairy dust objects ignore collisions with each other
    //   // fairyDust.collider.setCollisionGroups(
    //     (FAIRY_DUST_GROUP << 16) | // Membership (bits 16-31)
    //       (WORLD_GROUP | OTHER_GROUP) // Filter (bits 0-15)
    //   )
    //
    //   // Apply physics properties
    //   const impulseStrength = 6 + Math.random() * 5
    //   const randomDirection = new Vector3(
    //     (Math.random() - 0.5) * 0.5,
    //     0.5 + Math.random() * 0.5,
    //     (Math.random() - 0.5) * 0.5
    //   ).normalize()
    //
    //   fairyDust.rigidBody.applyImpulse(randomDirection.multiplyScalar(impulseStrength), true)
    // }

    fairyDustObjects.push(fairyDust)
  }

  return fairyDustObjects
}
