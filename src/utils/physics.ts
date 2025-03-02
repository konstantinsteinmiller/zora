import state from '@/states/GlobalState.ts'
import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d-compat'
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three'

const descMap: { [key: string]: any } = {
  fixed: RigidBodyDesc.fixed(),
  dynamic: RigidBodyDesc.dynamic(),
  kinematic: RigidBodyDesc.kinematicVelocityBased(),
}

export const createCollidersForGraph = (object: Object3D, rigidType: string = 'fixed', scale?: number) => {
  const colliders: any = []
  // console.log('object: ', object)
  object.traverse((child: Object3D) => {
    // console.log('child: ', child, child.isMesh)
    if ((child as Mesh).isMesh) {
      const { collider } = createCollider(child as Mesh, rigidType, scale)
      colliders.push(collider)
    }
  })
  return colliders
}
export const createCollider = (mesh: Mesh, rigidType: string = 'fixed', scale?: number) => {
  const desc = descMap[rigidType]
  const rigidBody = state.physics.createRigidBody(desc)

  const geo = mesh.geometry
  let vertices
  if (scale) {
    vertices = new Float32Array(geo.attributes.position.array.map((v: number) => v * scale))
  } else {
    vertices = new Float32Array(geo.attributes.position.array)
  }
  if (!geo.index) {
    console.error('No index buffer found for mesh')
    return { collider: null }
  }
  const indices = new Uint32Array(geo.index.array)
  const colliderDesc = ColliderDesc.trimesh(vertices, indices)
  colliderDesc.setCollisionGroups(0xffffffff) /* part of all groups and interacts with all groups */
  const collider = state.physics.createCollider(colliderDesc, rigidBody)
  return {
    collider,
  }
}

export const createColliderBall = (radius: number, rigidBody: any) => {
  const colliderDesc = ColliderDesc.ball(radius)
  return state.physics.createCollider(colliderDesc, rigidBody)
}

export const createRigidBodyEntity = (position: Vector3, halfHeight: number, colliderRadius: number) => {
  const desc: any = RigidBodyDesc.kinematicPositionBased()
  const offsetPosition = position.clone()
  desc.setTranslation(...offsetPosition)
  const rigidBody = state.physics.createRigidBody(desc)

  const colliderDesc = ColliderDesc.capsule(halfHeight, colliderRadius)
  colliderDesc.setCollisionGroups(0xffffffff) /* part of all groups and interacts with all groups */
  const collider = state.physics.createCollider(colliderDesc, rigidBody)

  return {
    rigidBody,
    collider,
  }
}

export const createEntityColliderBox = (entity: any) => {
  const width = entity.colliderRadius * 2.3
  const colliderBox: any = new Mesh(
    new BoxGeometry(width, entity.halfHeight * 2, entity.colliderRadius * 1.2),
    new MeshBasicMaterial({ color: 'blue', wireframe: true })
  )
  const pos = entity.mesh.position.clone()
  pos.y += entity.halfHeight * 100
  if (entity.name === 'player') {
    pos.x -= 10
  }
  colliderBox.position.copy(pos)
  colliderBox.name = 'colliderBox'
  colliderBox.entityId = entity.uuid
  colliderBox.visible = false
  // colliderBox.visible = true
  colliderBox.scale.set(100, 100, 100)
  entity.mesh.add(colliderBox)
}
