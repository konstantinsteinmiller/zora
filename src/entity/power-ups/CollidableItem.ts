import AssetLoader from '@/engine/AssetLoader.ts'
import waterArena from '@/entity/levels/water-arena/WaterArena.ts'
import { createBoxCollider } from '@/utils/physics.ts'
import { Group, Mesh, Vector3 } from 'three'
import state from '@/states/GlobalState.ts'
import { v4 } from 'uuid'

interface CollidableProps {
  meshPath: string
  name: string
  once?: boolean
  onCollisionStart?: (colliderA: any, colliderB: any, uuid: string) => void
  onCollisionEnd?: (colliderA: any, colliderB: any, uuid: string) => void
  onCleanup?: (collisionEvenUuid: string) => void
  position: Vector3
  colliderType?: string
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
  once = true,
  rotateMesh = false,
  size,
}: CollidableProps) => {
  const object: any = new Group()
  let mesh: any = new Mesh()
  const uuid = v4()
  const loadModels = async () => {
    const { loadMesh } = AssetLoader()
    await loadMesh(meshPath, object, 1)
    mesh = object.children[0] as Mesh
    mesh.name = name
    mesh.position.copy(position)

    if (rotateMesh) {
      mesh.geometry.computeBoundingBox()
      mesh.geometry.center() // Moves geometry so center is at (0,0,0)
      state.addEvent('renderer.update', () => {
        mesh.rotation.set(mesh.rotation.x, mesh.rotation.y + 0.03, mesh.rotation.z)
      })
    }
  }
  loadModels()

  const { collider } = createBoxCollider({
    size,
    position: position.clone().add(new Vector3(0, size * 0.5, 0)),
    isSensor: false,
  })
  collider.userData = { type: colliderType, uuid, name: name }

  const collisionUuid = state.addEvent('physics.collision', (colliderA: any, colliderB: any, started: boolean) => {
    if (colliderA.userData.uuid === uuid || colliderB.userData.uuid === uuid) {
      if (started) {
        onCollisionStart?.(colliderA, colliderB, uuid)

        if (once) {
          state.removeEvent('physics.collision', collisionUuid)
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

    const eventUuid = state.addEvent(`level.object.remove`, (colUuid: string | undefined) => {
      if (uuid !== colUuid) return
      // console.log('--remove mesh from level--')
      level.remove(object)
      level.objects = level.objects.filter((obj: any) => obj.uuid !== object.entityUuid)
      state.removeEvent(`level.object.remove`, eventUuid)
    })
  }

  object.entityUuid = uuid
  return object
}
