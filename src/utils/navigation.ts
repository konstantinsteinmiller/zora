import { BASE_NAVIGATION_MOVE_SPEED, MAX_FLY_IMPULSE, MIN_FLY_IMPULSE } from '@/enums/constants.ts'
import state from '@/states/GlobalState.ts'
import type { ClosestPortal, PortalConnection } from '@/types/world.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { clamp } from '@/utils/function.ts'
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
  } else {
    console.warn('Failed to find path found')
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

const findPathBetweenNavIslands = (path: Vector3[] | null, startPos: Vector3, targetPos: Vector3, startGroupId: number): Vector3[] => {
  /* handle islands */
  const pathfinder = state.level.pathfinder
  const zone = state.level.zone
  const targetGroupId: number = pathfinder.getGroup(zone, targetPos)
  const portalTransitionMap = pathfinder.portalTransitionMap
  const transitionPath = JSON.parse(JSON.stringify(portalTransitionMap[startGroupId][targetGroupId]))
  transitionPath.shift()

  if (path || startGroupId === targetGroupId) return path || []

  // No direct path? Use portal points
  let completePath: Vector3[] = []
  let currentStartPos = startPos
  let currentGroupId = startGroupId

  while (currentGroupId !== targetGroupId) {
    let closestPortal: ClosestPortal | null = null
    if (!transitionPath.length) return completePath
    const currentTargetGroupId = transitionPath.shift()

    pathfinder.portalConnectionsList.forEach((connection: PortalConnection) => {
      const { entryPosition, exitPosition, entryGroup, exitGroup } = connection

      if (entryGroup === currentGroupId && exitGroup === currentTargetGroupId) {
        const distance = currentStartPos.distanceTo(entryPosition)

        if (!closestPortal || distance < closestPortal.distance) {
          closestPortal = { entryPosition: entryPosition as Vector3, exitPosition: exitPosition as Vector3, exitGroupId: exitGroup, distance }
        }
      }
    })

    if (!closestPortal) return completePath

    // Add portal to path
    const { exitGroupId: portalExitGroupId } = closestPortal
    const segmentPath = pathfinder.findPath(currentStartPos, closestPortal.entryPosition, zone, currentGroupId) || []
    completePath = completePath.concat(segmentPath)

    // Move to next segment
    completePath.push({ ...closestPortal.exitPosition, isPortal: true })
    currentStartPos = closestPortal.exitPosition
    currentGroupId = portalExitGroupId
    // console.log('completePath: ', completePath)
  }

  // Final path to target
  const finalPath = pathfinder.findPath(currentStartPos, targetPos, zone, currentGroupId) || []
  // console.log('finalPath: ', finalPath)
  completePath = completePath.concat(finalPath)

  return completePath
}

const getRandomIslandGroupId = (): number => {
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

  // console.log('state.level.pathfinder: ', state.level.pathfinder)
  // const random = Math.random()
  const totalGroups = state.level.pathfinder.zones[zone].groups.length
  let random = Math.floor(Math.random() * totalGroups)
  random = clamp(0, totalGroups - 1, random)
  // console.log('random: ', random)
  return random

  // return 5
  // return 0
  // return islandWeightsList.findIndex((weight: number) => random < weight)
}

const moveAgentAlongPath = (path: any[], entity: any, targetToFace: any) => {
  if (!path) return

  let nextPosition: { x: number; y: number; z: number; isPortal?: boolean } | null = null
  let previousPosition: { x: number; y: number; z: number; isPortal?: boolean } | null = null
  let uuid: string | null = null

  state.level.movingEntitiesList.push(entity.name)

  entity.isMoving = true
  uuid = state.addEvent('renderer.update', (deltaS: number) => {
    const targetPosition: Vector3 | undefined = new Vector3()
    if (!nextPosition && path.length) nextPosition = path.shift()
    if (!nextPosition) return

    targetPosition.set(nextPosition.x, nextPosition.y, nextPosition.z)
    const isPortal = !!nextPosition.isPortal

    const agentPos = entity.mesh.position.clone()
    let distance = null
    try {
      const flatAgentPos = agentPos.clone().setY(0)
      const flatNextPosition = targetPosition?.clone().setY(0)
      distance = flatAgentPos.distanceTo(flatNextPosition)
    } catch (e: any) {
      // console.warn('distance error: ', e)
    }
    if (!distance) return
    const velocity: Vector3 = targetPosition?.clone().sub(agentPos)

    // console.log('distance: ', distance)
    if (distance > 0.2) {
      velocity.normalize().multiplyScalar(BASE_NAVIGATION_MOVE_SPEED)

      // 🔹 Convert velocity to local space
      const localVelocity = velocity.clone().applyQuaternion(entity.mesh.quaternion.clone().invert())

      const movementVector = calcRapierMovementVector(entity, localVelocity, deltaS)
      agentPos.add(localVelocity)

      if (isPortal) {
        /* if nextPosition is a portal=off-navmesh, we need to fly to the island */
        const heightDiff = targetPosition.y - entity.mesh.position.y
        if ((heightDiff > 0.1 && entity.appliedFlyImpulse < MIN_FLY_IMPULSE) || (heightDiff > 1 && entity.appliedFlyImpulse < MAX_FLY_IMPULSE * 0.7)) {
          entity.appliedFlyImpulse = MAX_FLY_IMPULSE
          entity.stateMachine.currentState.name !== 'fly' && entity.stateMachine.setState('fly')
        }
        /* glide down */
        const prevHeightDiff = previousPosition ? targetPosition.y - previousPosition.y : 0
        if (previousPosition && prevHeightDiff < 1) {
          entity.appliedFlyImpulse = MAX_FLY_IMPULSE * 0.05
          entity.stateMachine.currentState.name !== 'fly' && entity.stateMachine.setState('fly')
        }
      }

      if (targetToFace) {
        /* maybe refactor is the facing rotation is instant */
        entity.mesh.lookAt(targetToFace.position.x, entity.position.y, targetToFace.position.z)

        /* set animation based on if agent is looking in the running direction or not */
        if (!isPortal || (!entity.isAnimState('fly') && entity.isGrounded)) {
          const entityForwardN = new Vector3(0, 0, 1).applyQuaternion(entity.mesh.quaternion).normalize()
          const directionN: Vector3 = targetPosition?.clone().sub(agentPos).normalize()
          const facingFactor = entityForwardN.dot(directionN)
          if (facingFactor < 0 && entity.stateMachine.currentState.name !== 'run-back') {
            !entity.isAnimState('run-back') && entity.stateMachine.setState('run-back')
          } else if (facingFactor >= 0 && entity.stateMachine.currentState.name !== 'run') {
            !entity.isAnimState('run') && entity.stateMachine.setState('run')
          }
        }
      } else {
        // look at next waypoint
        const flatTargetPos: Vector3 = new Vector3(targetPosition.x, agentPos.y, targetPosition.z)
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
      entity.isMoving = false
      // console.log('reached destination: ', entity.isMoving)
    } else {
      /* reached a waypoint */
      previousPosition = nextPosition
      nextPosition = null
      return
    }
  })
}

export const moveToRandomPosition = (entity: any, targetToFace: any) => {
  if (entity.isMoving) {
    // Math.random() < 0.1 && console.log('agent is moving: ')
    return
  }

  if (!addedAxesHelper && state.enbaleDebug) {
    axesHelper = new AxesHelper(2)
    state.scene.add(axesHelper)
    addedAxesHelper = true
  }

  const pathfinder = state.level.pathfinder
  const zone = state.level.zone
  const pos = entity.position.clone()
  const radius = 25
  let randomTargetPosition = null
  try {
    const targetGroupId = getRandomIslandGroupId()
    randomTargetPosition = pathfinder.getRandomNode(zone, targetGroupId, pos, radius)
  } catch (e: any) {
    // console.warn('no random position found: ')
  }
  if (!randomTargetPosition) return

  const path = findPathToRandomPosition(entity, randomTargetPosition)

  moveAgentAlongPath(path, entity, targetToFace)
}

export const findPathToRandomPosition = (entity: any, targetPos: any = { x: 2.75, y: -1.15, z: 1.23 }) => {
  if (entity.isMoving) return
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
  if (entity.isMoving) return
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
  entity.isMoving = true
}
