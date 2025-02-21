import type { PortalConnection } from '@/types/world.ts'
import { saveDataToFile } from '@/utils/io.ts'
import { generateTransitionMap } from '@/utils/pathfinder.ts'
import { Vector3 } from 'three'

export const orientationPosition = {
  x: -1.95,
  y: -0.95,
  z: -3.57,
  // groupId: 1,
}

const calcAllPortalConnections = (portalsList: PortalConnection[]) => {
  let allConnectionsList: PortalConnection[] = []
  portalsList.forEach((connection: PortalConnection) => {
    const { entryPosition, exitPosition, entryGroup, exitGroup } = connection
    const entryPosVec3 = new Vector3().copy(entryPosition)
    const exitPosVec3 = new Vector3().copy(exitPosition)

    const portalConnectionsList: PortalConnection[] = [
      { entryPosition: entryPosVec3, exitPosition: exitPosVec3, entryGroup: entryGroup, exitGroup: exitGroup },
      { entryPosition: exitPosVec3, exitPosition: entryPosVec3, entryGroup: exitGroup, exitGroup: entryGroup },
    ]
    allConnectionsList = allConnectionsList.concat(portalConnectionsList)
  })
  return allConnectionsList
}
const oneWayPortalConnectionsList: PortalConnection[] = [
  {
    entryPosition: {
      x: 1.65,
      y: -0.95,
      z: -0.77,
    },
    exitPosition: {
      x: -1.67,
      y: 1.14,
      z: 0.19,
    },
    entryGroup: 1,
    exitGroup: 5,
  },
  {
    entryPosition: {
      x: 1.65,
      y: -0.95,
      z: -0.77,
    },
    exitPosition: {
      x: -1.95,
      y: -0.95,
      z: -3.57,
    },
    entryGroup: 1,
    exitGroup: 5,
  },
  {
    entryPosition: {
      x: 1.65,
      y: -0.95,
      z: -0.77,
    },
    exitPosition: {
      x: -3.95,
      y: -1.08,
      z: 2.96,
    },
    entryGroup: 1,
    exitGroup: 5,
  },
  {
    entryPosition: {
      x: 8.45,
      y: -2.28,
      z: 11.73,
    },
    exitPosition: {
      x: 7.65,
      y: 3.25,
      z: 15.93,
    },
    entryGroup: 1,
    exitGroup: 0,
  },
  {
    entryPosition: {
      x: -15.75,
      y: -2.15,
      z: 4.43,
    },
    exitPosition: {
      x: -18.45,
      y: 2.05,
      z: 6.73,
    },
    entryGroup: 1,
    exitGroup: 2,
  },
  {
    entryPosition: {
      x: 14.44,
      y: -2.08,
      z: -6.06,
    },
    exitPosition: {
      x: 16.75,
      y: 3.25,
      z: -7.87,
    },
    entryGroup: 1,
    exitGroup: 3,
  },
  {
    entryPosition: {
      x: -9.58,
      y: -2.35,
      z: -12.34,
    },
    exitPosition: {
      x: -10.65,
      y: 3.25,
      z: -16.47,
    },
    entryGroup: 1,
    exitGroup: 4,
  },
]
export const portalConnectionsList: PortalConnection[] = calcAllPortalConnections(oneWayPortalConnectionsList)

let data
const fileName = 'portalTransitionMap.json'
const tryLoadPortalTransitionMap = async () => {
  try {
    data = await import(`./${fileName}`)
  } catch (e: any) {
    data = null
  }
}
tryLoadPortalTransitionMap()
const transitionData = data ? data?.default : generateTransitionMap(portalConnectionsList)
if (!data) saveDataToFile(transitionData, fileName)

export const portalTransitionMap = transitionData
