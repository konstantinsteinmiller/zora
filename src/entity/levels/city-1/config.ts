import type { PortalConnection } from '@/types/world.ts'
import { generateTransitionMap } from '@/utils/pathfinder.ts'
import { Vector3 } from 'three'

export const startPositions = [
  {
    x: 0,
    y: 5,
    z: 0,
    orientation: { phi: -0.374497751783192, theta: -0.07528230865746549 },
  },
  {
    x: -10.44,
    y: 0,
    z: -5.88,
    quaternion: [0.0027200013169103635, -0.884378594230388, 0.005153923685818877, 0.46673390784317265],
  },
]
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
]

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

export const portalConnectionsList: PortalConnection[] = calcAllPortalConnections(oneWayPortalConnectionsList)

let transitionData: any = {
  '0': {
    '0': [],
    '1': [0, 1],
    '2': [0, 1, 2],
    '3': [0, 1, 3],
    '4': [0, 1, 4],
    '5': [0, 1, 5],
  },
  '1': {
    '0': [1, 0],
    '1': [],
    '2': [1, 2],
    '3': [1, 3],
    '4': [1, 4],
    '5': [1, 5],
  },
  '2': {
    '0': [2, 1, 0],
    '1': [2, 1],
    '2': [],
    '3': [2, 1, 3],
    '4': [2, 1, 4],
    '5': [2, 1, 5],
  },
  '3': {
    '0': [3, 1, 0],
    '1': [3, 1],
    '2': [3, 1, 2],
    '3': [],
    '4': [3, 1, 4],
    '5': [3, 1, 5],
  },
  '4': {
    '0': [4, 1, 0],
    '1': [4, 1],
    '2': [4, 1, 2],
    '3': [4, 1, 3],
    '4': [],
    '5': [4, 1, 5],
  },
  '5': {
    '0': [5, 1, 0],
    '1': [5, 1],
    '2': [5, 1, 2],
    '3': [5, 1, 3],
    '4': [5, 1, 4],
    '5': [],
  },
}
/* in case you haven't generated the transition data yet */
if (transitionData === null) {
  transitionData = generateTransitionMap(portalConnectionsList)
  console.log(JSON.stringify(transitionData, undefined, 2))
}
export const portalTransitionMap = transitionData
