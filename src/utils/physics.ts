import state from '@/states/GlobalState.ts'
import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d-compat'
import { Mesh, Object3D, Vector3 } from 'three'

const descMap: { [key: string]: any } = {
  fixed: RigidBodyDesc.fixed(),
  dynamic: RigidBodyDesc.dynamic(),
  kinematic: RigidBodyDesc.kinematicVelocityBased(),
}

export const createCollidersForGraph = (object: Object3D, rigidType: string = 'fixed', scale?: number) => {
  const colliders: any = []
  object.traverse((child: Object3D) => {
    if (child.isMesh) {
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
  const indices = new Uint32Array(geo.index.array)
  const colliderDesc = ColliderDesc.trimesh(vertices, indices)
  const collider = state.physics.createCollider(colliderDesc, rigidBody)
  return {
    collider,
  }
}

export const createColliderBall = (radius: number, rigidBody: any) => {
  const colliderDesc = ColliderDesc.ball(radius)
  return state.physics.createCollider(colliderDesc, rigidBody)
}

export const createRigidBodyEntity = (position: Vector3, height: number) => {
  const desc: any = RigidBodyDesc.kinematicPositionBased()
  const offsetPosition = position.clone().add(new Vector3(3, 1, 2))
  desc.setTranslation(...offsetPosition)
  const rigidBody = state.physics.createRigidBody(desc)

  const colliderDesc = ColliderDesc.capsule(height * 0.5, 0.5)
  const collider = state.physics.createCollider(colliderDesc, rigidBody)

  return {
    rigidBody,
    collider,
  }
}
