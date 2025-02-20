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

let axesHelper: any
let addedAxesHelper = false

const findPathBetweenNavIslands = (path: any[], startPos: Vector3, targetPos: Vector3, startGroupId: number) => {
  /* handle islands */
  const pathfinder = state.level.pathfinder
  const zone = state.level.zone
  const targetGroupId = pathfinder.getGroup(zone, targetPos)
  if (!path && startGroupId !== targetGroupId) {
    // No direct path? Use portal points
    const groupIdsList = [startGroupId, targetGroupId]
    const closestPortal: any = {
      position: {},
      distance: -1,
    }
    pathfinder.customPortals.forEach((portal: any) => {
      const portalA = portal[0]
      const portalB = portal[1]
      const portalAPos = new Vector3(portalA.x, portalA.y, portalA.z)
      const distance = startPos.distanceTo(portalAPos)
      const hasCorrectGroupIds = groupIdsList.includes(portalA.groupId) && groupIdsList.includes(portalB.groupId)

      /* overwrite further away portal points */
      if ((distance < closestPortal.distance || closestPortal.distance === -1) && hasCorrectGroupIds) {
        closestPortal.position = portalAPos
        closestPortal.exitPosition = new Vector3(portalB.x, portalB.y, portalB.z)
        closestPortal.distance = distance
      }
    })
    if (closestPortal.distance === -1) return []

    path = pathfinder.findPath(startPos, closestPortal.position, zone, startGroupId) || []
    path.push(closestPortal.exitPosition)
    /* path = g1pos1 -> g1pos2 -> closestPortal.position | closestPortal.exitPosition -> g2pos1 -> ...*/
    const newGroup = pathfinder.getGroup(zone, closestPortal.exitPosition)
    const newPath = pathfinder.findPath(closestPortal.exitPosition, targetPos, zone, newGroup) || []
    path = path.concat(newPath)
  }
  return path
}

const getRandomIslandGroupId = () => {
  const pathfinder = state.level.pathfinder
  const zone = state.level.zone
  const islandsMap: { totalWeights: number; totalNodes: number } = {
    totalWeights: 0,
    totalNodes: 0,
  }

  pathfinder.zones[zone].groups.forEach((group: any[]) => {
    islandsMap.totalNodes += group.length
  })

  const islandWeightsList: number[] = []
  pathfinder.zones[zone].groups.forEach((group: any[]) => {
    const weight: number = islandsMap.totalNodes > 0 ? +(group.length / islandsMap.totalNodes).toFixed(3) : 0
    islandsMap.totalWeights += weight
    islandsMap.totalWeights = +islandsMap.totalWeights.toFixed(3)
    islandWeightsList.push(islandsMap.totalWeights)
  })

  const random = Math.random()
  const randomTargetGroupId = islandWeightsList.findIndex((weight: number) => random < weight)
  // randomTargetGroupId = 5
  return randomTargetGroupId
}

export const moveToRandomPosition = (entity: any, targetToFace: any) => {
  if (!addedAxesHelper && state.enbaleDebug) {
    axesHelper = new AxesHelper(2)
    state.scene.add(axesHelper)
    addedAxesHelper = true
  }

  const pathfinder = state.level.pathfinder
  const zone = state.level.zone
  const pos = entity.position.clone()
  // const groupId = pathfinder.getGroup(zone, pos)
  const radius = 25
  let randomTargetPosition = null
  try {
    const targetGroupId = getRandomIslandGroupId()
    randomTargetPosition = pathfinder.getRandomNode(zone, targetGroupId, pos, radius)
  } catch (e: any) {
    // console.warn('no random position found: ', e)
  }
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
      } catch (e: any) {
        // console.warn('distance error: ', e)
      }
      if (!distance) return
      const velocity = nextPosition.clone().sub(agentPos)

      // console.log('distance: ', distance)
      if (distance > 0.2) {
        velocity.normalize().multiplyScalar(BASE_NAVIGATION_MOVE_SPEED)

        // 🔹 Convert velocity to local space
        const localVelocity = velocity.clone().applyQuaternion(entity.mesh.quaternion.clone().invert())

        const movementVector = calcRapierMovementVector(entity, localVelocity, deltaS)
        agentPos.add(localVelocity)

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
          const flatTargetPos: Vector3 = new Vector3(nextPosition.x, agentPos.y, nextPosition.z)
          entity.setRotation(entity.mesh.lookAt(flatTargetPos)?.quaternion)
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
  const { zone } = state.waterArena

  const startGroupId = pathfinder.getGroup(zone, meshPosition)
  let closest = pathfinder.getClosestNode(meshPosition, zone, startGroupId, true)

  if (closest === null) {
    try {
      closest = findClosestPointInCircle(meshPosition)
    } catch (e: any) {
      closest = new Vector3().copy(pathfinder.orientationPosition)
    }
    if (closest === null) return
  }

  const startPos = closest.centroid
  let path = pathfinder.findPath(startPos, targetPos, zone, startGroupId)

  path = findPathBetweenNavIslands(path, startPos, targetPos, startGroupId)

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
