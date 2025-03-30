import $ from '@/global'
import Rapier, { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d-compat'
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three'

const descMap: { [key: string]: any } = {
  fixed: RigidBodyDesc.fixed(),
  dynamic: RigidBodyDesc.dynamic(),
  kinematic: RigidBodyDesc.kinematicVelocityBased(),
}

export const createCollidersForGraph = (object: any, rigidType: string = 'fixed', scale?: number, rotate?: number) => {
  const colliders: any = []
  // console.log('object: ', object)
  object.traverse((child: Object3D) => {
    // console.log('child: ', child, child.isMesh)
    if ((child as Mesh).isMesh) {
      const { collider } = createCollider(child as Mesh, rigidType, scale, rotate)
      collider.setFriction(0.5) // Important: World needs friction too!
      colliders.push(collider)
    }
  })
  return colliders
}

export const createCollider = (mesh: Mesh, rigidType: string = 'fixed', scale?: number, rotate?: number) => {
  const desc = descMap[rigidType]
  const rigidBody = $.physics.createRigidBody(desc)

  let geo = mesh.geometry
  if (rotate !== null && rotate !== undefined) {
    geo = geo.clone().rotateX(rotate)
  }
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
  const collider = $.physics.createCollider(colliderDesc, rigidBody)
  return { collider }
}

export const createColliderBall = (radius: number, rigidBody: any) => {
  const colliderDesc = ColliderDesc.ball(radius)
  return $.physics.createCollider(colliderDesc, rigidBody)
}
export const createBoxCollider = ({
  size,
  position,
  isSensor = false,
}: {
  size: number
  position: Vector3
  isSensor: boolean
}) => {
  const rigidBody = $.physics.createRigidBody(RigidBodyDesc.fixed())
  rigidBody.setTranslation(new Rapier.Vector3(position.x, position.y, position.z), false)

  const collDesc = ColliderDesc.cuboid(size, size, size)
  const colliderDesc = isSensor ? collDesc.setSensor(isSensor) : collDesc

  colliderDesc.setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
  colliderDesc.setCollisionGroups(0x0010fff0)
  colliderDesc.setSolverGroups(0x00100000) // No solver interaction
  colliderDesc.setActiveCollisionTypes(
    Rapier.ActiveCollisionTypes.DEFAULT | Rapier.ActiveCollisionTypes.KINEMATIC_FIXED
  )

  // Create the collider
  const collider = $.physics.createCollider(colliderDesc, rigidBody)
  collider.userData = { type: 'fixed', uuid: 'collidable' }
  return { collider, rigidBody }
}

export const createRigidBodyEntity = ({ position, entity }: { position: Vector3; entity: any }) => {
  const desc: any = RigidBodyDesc.kinematicPositionBased()
  const offsetPosition = position.clone()
  desc.setTranslation(...offsetPosition)
  const rigidBody = $.physics.createRigidBody(desc)

  const colliderDesc = ColliderDesc.capsule(entity.halfHeight, entity.colliderRadius)

  colliderDesc.setCollisionGroups(0xffffffff) /* part of all groups and interacts with all groups */
  colliderDesc.setSolverGroups(0xffffffff)
  colliderDesc.setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
  colliderDesc.setActiveCollisionTypes(
    Rapier.ActiveCollisionTypes.DEFAULT | Rapier.ActiveCollisionTypes.KINEMATIC_FIXED
  )

  const collider = $.physics.createCollider(colliderDesc, rigidBody)
  collider.userData = { type: 'kinematic', uuid: entity.uuid, name: entity.name }

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
  if (entity.guild === 'guild-0') {
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
