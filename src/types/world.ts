import type { Vector3 } from 'three'

interface vec3 {
  x: number
  y: number
  z: number
}
export interface Portal {
  x: number
  y: number
  z: number
  groupId: number
}
export interface PortalConnection {
  entryPosition: vec3 | Vector3
  exitPosition: vec3 | Vector3
  entryGroup: number
  exitGroup: number
}
export interface ClosestPortal {
  entryPosition: Vector3
  exitPosition: Vector3
  exitGroupId: number
  distance: number
}
