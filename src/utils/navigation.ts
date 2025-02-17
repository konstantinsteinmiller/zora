import { BASE_NAVIGATION_MOVE_SPEED } from '@/enums/constants.ts'
import state from '@/states/GlobalState.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import Rapier from '@dimforge/rapier3d-compat'
import { AxesHelper, Mesh, Vector3 } from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export const loadNavMesh = async (path: string, callback: (navMesh: Mesh) => void) => {
  if (path.endsWith('.glb')) {
    const loaderGlb = new GLTFLoader()
    const model: any = await loaderGlb.loadAsync(path)

    model.children[0].scale.set(1, 1, 1)
    callback(model?.children[0])
  } else if (path.endsWith('.fbx')) {
    const loaderFbx = new FBXLoader()
    const model: any = await loaderFbx.loadAsync(path)

    model.children[0].scale.set(1, 1, 1)
    callback(model?.children[0])
  }
}

const displayPath = (path: any, startPos: Vector3, targetPos: Vector3): void => {
  if (path) {
    const pathfindingHelper = state.level.pathfinder.pathfindingHelper
    pathfindingHelper.reset()
    pathfindingHelper.setPlayerPosition(startPos)
    pathfindingHelper.setTargetPosition(targetPos)
    pathfindingHelper.setPath(path)
  }
}

/* find closest point on navmesh by increasing radius
 * around agent position */
const findClosestPointInCircle = (meshPosition: Vector3) => {
  let closest = null
  const pathfinder = state.level.pathfinder
  let radius = 0.2
  let angle = 0
  while (closest === null && radius < 1.5) {
    const pos = meshPosition.clone()

    pos.x += radius * Math.cos(angle)
    pos.z += radius * Math.sin(angle)
    const groupId = pathfinder.getGroup(state.level.zone, pos)
    closest = pathfinder.getClosestNode(pos, state.level.zone, groupId, true)
    angle += Math.PI / 3
    if (angle >= Math.PI * 2 - 0.2) {
      angle = 0
      radius += 0.2
    }
  }
  return closest
}

const axesHelper = new AxesHelper(2)
let addedAxesHelper = false
export const moveToRandomPosition = (entity: any, targetToFace: any) => {
  if (!addedAxesHelper) {
    state.scene.add(axesHelper)
    addedAxesHelper = true
  }

  const pathfinder = state.level.pathfinder
  const zone = state.level.zone
  const pos = entity.position.clone()
  const groupId = pathfinder.getGroup(zone, pos)
  const radius = 25
  let randomTargetPosition = null
  try {
    randomTargetPosition = pathfinder.getRandomNode(zone, groupId, pos, radius)
  } catch (e) {}
  if (!randomTargetPosition) {
    // console.warn('no random position found: ', randomTargetPosition)
    return
  }

  const path = findPathToRandomPosition(entity, randomTargetPosition)
  if (path) {
    // console.log('moving to path: ', path)
    let nextPosition: Vector3 | null = null
    let uuid: string | null = null

    state.level.movingEntitiesList.push(entity.name)

    const started = false
    uuid = state.addEvent('renderer.update', (deltaS: number) => {
      if (started) return
      if (!nextPosition && path.length) nextPosition = path.shift()

      const agentPos = entity.mesh.position.clone()
      let distance = null
      try {
        const flatAgentPos = agentPos.clone().setY(0)
        const flatNextPosition = nextPosition.clone().setY(0)
        distance = flatAgentPos.distanceTo(flatNextPosition)
      } catch (e) {}
      if (!distance) return
      const velocity = nextPosition.clone().sub(agentPos)

      // console.log('distance: ', distance)
      if (distance > 0.2) {
        velocity.normalize().multiplyScalar(BASE_NAVIGATION_MOVE_SPEED)

        // 🔹 Convert velocity to local space
        const localVelocity = velocity.clone().applyQuaternion(entity.mesh.quaternion.clone().invert())

        const movementVector = calcRapierMovementVector(entity, localVelocity, deltaS)
        /* make axesHelper look at the next waypoint in navmesh so we can
         * rotate player mesh after it */
        agentPos.add(localVelocity)
        axesHelper.position.set(movementVector.x, movementVector.y + entity.halfHeight, movementVector.z)
        axesHelper.lookAt(new Vector3(nextPosition.x, axesHelper.position.y, nextPosition.z))

        if (targetToFace) {
          entity.mesh.lookAt(targetToFace.position.x, entity.position.y, targetToFace.position.z)
          const entityForwardN = new Vector3(0, 0, 1).applyQuaternion(entity.mesh.quaternion).normalize()
          const directionN = nextPosition.clone().sub(agentPos).normalize()
          const facingFactor = entityForwardN.dot(directionN)
          if (facingFactor < 0 && entity.stateMachine.currentState.name !== 'run-back') {
            entity.stateMachine.setState('run-back')
          } else if (facingFactor >= 0 && entity.stateMachine.currentState.name !== 'run') {
            entity.stateMachine.setState('run')
          }
        } else {
          // look at next waypoint
          entity.setRotation(axesHelper.quaternion)
        }

        const nextPhysicsPos = new Rapier.Vector3(movementVector.x, movementVector.y, movementVector.z)
        entity.rigidBody.setNextKinematicTranslation(nextPhysicsPos)
      } else if (uuid && !path.length) {
        /* reached destination remove event and moving entity */
        entity.stateMachine.setState('idle')
        state.removeEvent('renderer.update', uuid)
        state.scene.remove(axesHelper)
        addedAxesHelper = false
        state.level.movingEntitiesList = state.level.movingEntitiesList.filter((name: string) => name !== entity.name)
        state.level.pathfinder.isMoving = false
      } else {
        /* reached a waypoint */
        nextPosition = null
        return
      }
    })
    state.level.pathfinder.isMoving = true
  }
}

export const findPathToRandomPosition = (entity: any, targetPos: any = { x: 2.75, y: -1.15, z: 1.23 }) => {
  if (state.level.pathfinder.isMoving) return
  // Find path from A to B.
  const pathfinder = state.level.pathfinder
  const meshPosition = entity.mesh.position.clone()

  const groupId = pathfinder.getGroup(state.level.zone, meshPosition)
  let closest = pathfinder.getClosestNode(meshPosition, state.level.zone, groupId, true)

  if (closest === null) {
    closest = findClosestPointInCircle(meshPosition)
    if (closest === null) return
  }

  const startPos = closest.centroid
  const path = pathfinder.findPath(startPos, targetPos, state.waterArena.zone, groupId)
  displayPath(path, startPos, targetPos)
  return path
}

export const findPathToTargetPosition = (entity: any, targetPos: any = { x: 2.75, y: -1.15, z: 1.23 }) => {
  if (state.level.pathfinder.isMoving) return
  // Find path from A to B.
  const pathfinder = state.level.pathfinder
  const meshPosition = entity.mesh.position.clone()

  const groupId = pathfinder.getGroup(state.level.zone, meshPosition)
  let closest = pathfinder.getClosestNode(meshPosition, state.level.zone, groupId, true)

  if (closest === null) {
    closest = findClosestPointInCircle(meshPosition)
    if (closest === null) return
  }

  const startPos = closest.centroid
  const path = pathfinder.findPath(startPos, targetPos, state.waterArena.zone, groupId)
  console.log('path: ', path)
  displayPath(path, startPos, targetPos)
  state.level.pathfinder.isMoving = true
}
