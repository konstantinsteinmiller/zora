import AssetLoader from '@/engine/AssetLoader.ts'
import { type Guild, guildList } from '@/types/entity.ts'
import useUser from '@/use/useUser.ts'
import { createBoxCollider } from '@/utils/physics.ts'
import { EventEmitter } from 'events'
import { Group, Mesh, Vector3 } from 'three'
import $, { getEntity } from '@/global'
import { v4 } from 'uuid'

interface CollidableProps {
  meshPath: string
  name: string
  once?: boolean
  onCollisionStart?: (colliderA: any, colliderB: any, uuid: string, entity?: any) => void
  onCollisionEnd?: (colliderA: any, colliderB: any, uuid: string, entity?: any) => void
  onCleanup?: (collisionEvenUuid: string) => void
  position: Vector3
  colliderType?: string
  collisionSound?: {
    name: string
    options: any
  }
  onlyInteractableByGuild?: Guild
  rotateMesh?: boolean
  size: number
}

export default ({
  meshPath,
  name,
  onCollisionStart,
  onCollisionEnd,
  onCleanup,
  position,
  colliderType = 'fixed',
  collisionSound,
  once = true,
  onlyInteractableByGuild,
  rotateMesh = false,
  size,
}: CollidableProps) => {
  const { userSoundVolume } = useUser()

  const object: any = new Group()
  let mesh: any = new Mesh()
  const uuid = v4()
  const emitter = new EventEmitter()
  object.emitter = emitter

  const loadModels = async () => {
    const { loadMesh } = AssetLoader()
    await loadMesh(meshPath, object, 1)
    mesh = object.children[0] as Mesh
    mesh.name = name
    mesh.position.copy(position)

    if (rotateMesh) {
      mesh.geometry.computeBoundingBox()
      mesh.geometry.center() // Moves geometry so center is at (0,0,0)
    }
  }
  loadModels()

  const { rigidBody, collider } = createBoxCollider({
    size,
    position: position.clone().add(new Vector3(0, size * 0.5, 0)),
    isSensor: false,
  })
  collider.userData = { type: colliderType, uuid, name: name }

  const updateUuid = $.addEvent('renderer.update', () => {
    mesh.rotation.set(mesh.rotation.x, mesh.rotation.y + 0.03, mesh.rotation.z)

    if (!object?.rigidBody || !rigidBody || !object.rigidBody.isValid()) return
    /* sync the collider box position with the dynamic body */
    rigidBody.setTranslation(object.rigidBody.translation())
  })

  const collisionUuid = $.addEvent('physics.collision', (colliderA: any, colliderB: any, started: boolean) => {
    if (colliderA.userData.uuid === uuid || colliderB.userData.uuid === uuid) {
      if (started) {
        let entity = null
        const entityA = getEntity(colliderA.userData.uuid)
        const entityB = getEntity(colliderB.userData.uuid)
        entity = guildList.includes(entityA?.guild) ? entityA : guildList.includes(entityB?.guild) ? entityB : null

        /* don't allow collision if onlyInteractableByGuild is set */
        if (entity && onlyInteractableByGuild !== undefined && entity.guild !== onlyInteractableByGuild) return

        if (entity && collisionSound?.name && entity.guild === 'guild-0') {
          $.sounds.addAndPlayPositionalSound(entity, collisionSound.name, {
            volume: userSoundVolume.value * (collisionSound.options?.volume || 1),
          })
        }

        onCollisionStart?.(colliderA, colliderB, uuid, entity)

        if (once) {
          $.removeEvent('physics.collision', collisionUuid)
        }
      } else {
        onCollisionEnd?.(colliderA, colliderB, uuid)
      }
      onCleanup?.(collisionUuid)
    }
  })
  mesh.collider = collider

  object.addToLevel = (level: any) => {
    level.add(object)
    level.objects.push(object)

    const cleanup = () => {
      // console.log('--collidable cleanup--')
      if (rigidBody) {
        $.physics.removeRigidBody(rigidBody)
      }

      level.remove(object)
      level.objects = level.objects.filter((obj: any) => obj.uuid !== object.entityUuid)
      mesh.geometry.dispose()
      mesh.material.dispose()

      $.removeEvent('renderer.update', updateUuid)
      emitter.off('cleanup', cleanup)
    }
    emitter.on('cleanup', cleanup)
  }

  object.entityUuid = uuid
  return object
}
