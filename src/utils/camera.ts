import state from '@/states/GlobalState.ts'
import { Quaternion, Vector3 } from 'three'

export const getXRotation = (phi: number, phiSpeed: number) => {
  let xh = state.controls.mouse.current.mouseXDelta / innerWidth

  if (state.controls.left || state.controls.right) {
    xh = state.controls.left ? -1.5 / innerWidth : 1.5 / innerWidth
  } else {
    xh = state.controls.mouse.current.mouseXDelta / innerWidth
  }

  phi += -xh * phiSpeed
  const qx = new Quaternion()
  qx.setFromAxisAngle(new Vector3(0, 1, 0), phi)
  const q = new Quaternion()
  return q.multiply(qx)
}
