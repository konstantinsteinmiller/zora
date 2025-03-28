import type { PortalConnection } from '@/types/world'
import { generateTransitionMap } from '@/utils/pathfinder'
import { Vector3 } from 'three'

export const orientationPosition = {
  x: -1.95,
  y: -0.95,
  z: -3.57,
  // groupId: 1,
}
export const startPositions = [
  {
    x: 10.5,
    y: 0,
    z: 5,
    orientation: { phi: -1.974497751783192, theta: -0.07528230865746549 },
  },
  {
    x: -10.44,
    y: 0,
    z: -5.88,
    quaternion: [0.0027200013169103635, -0.884378594230388, 0.005153923685818877, 0.46673390784317265],
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
      x: 0.55,
      y: -0.95,
      z: -2.47,
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
      x: -6.25,
      y: -1.07,
      z: -1.2,
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
      x: 0.65,
      y: -1.15,
      z: 2.83,
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
      x: 1.35,
      y: -1.48,
      z: 3.93,
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
      x: -4.46,
      y: -0.95,
      z: -2.66,
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
      x: -5.45,
      y: -1.02,
      z: -0.17,
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
// console.log(JSON.stringify(portalConnectionsList, undefined, 2))
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

// const loadTransitionDataFromFile = async () => {
//   let data
//   const fileName = 'portalTransitionMap.json'
//   const tryLoadPortalTransitionMap = async () => {
//     try {
//       data = await import(`./${fileName}`)
//     } catch (e: any) {
//       data = null
//     }
//   }
//   await tryLoadPortalTransitionMap()
//   transitionData = data ? data?.default : generateTransitionMap(portalConnectionsList)
//   if (!data) saveDataToFile(transitionData, fileName)
// }

export const coverPositions = [
  { x: 8.45, y: -2.28, z: 11.73 },
  { x: 1.35, y: -2.35, z: 13.33 },
  { x: -5.85, y: -2.35, z: 13.23 },
  { x: -14.92, y: -2.42, z: 2.53 },
  { x: -6.15, y: -2.48, z: -13.57 },
  { x: 1.28, y: -2.22, z: -15.6 },
  { x: 8.65, y: -2.22, z: -13.47 },
  { x: 0.58, y: -1.14, z: 1.45 },
  { x: -1.68, y: -0.98, z: -2.74 },
  { x: -1.9, y: -1.15, z: 2.29 },
  { x: -3.85, y: -1.0, z: 0.85 },
  { x: -3.49, y: -1.07, z: -1.63 },
  { x: 13.05, y: -2.42, z: -0.37 },
  { x: 1.65, y: -0.95, z: -0.77 },
]
