import * as THREE from 'three'
import { Vector3 } from 'three'
import System, { SpriteRenderer, GPURenderer } from 'three-nebula'
// import Nebula, { Emitter, Rate, Span, Position, Mass, Radius, Life, Velocity, PointZone, Vector3D, Alpha, Scale, Color } from 'three-nebula'
// import TwinShot from '@/vfx/twin-shot.json'
import TwinShot from '@/vfx/twin-shot_2.json'

export const createTwinShotVFX = async (intersectPoint: Vector3) => {
  const adjustedPosition = window.player.getPosition.clone()
  adjustedPosition.y += 1
  adjustedPosition.z += 0.5

  const system = await System.fromJSONAsync(TwinShot.particleSystemState, THREE)
  // const nebulaRenderer = new SpriteRenderer(window.scene, THREE)
  const nebulaRenderer = new GPURenderer(window.scene, THREE)
  const nebulaSystem = system.addRenderer(nebulaRenderer)

  // console.log('nebulaSystem: ', nebulaSystem)
  const playerRotation = window.player.getRotation

  const forwardNormal = new THREE.Vector3(0, 0, 1)
  forwardNormal.applyQuaternion(playerRotation)
  forwardNormal.normalize()
  forwardNormal.multiplyScalar(0.03)

  nebulaSystem.emitters.forEach((emitter: any) => {
    /* adjust the force field of the emitters to get proper rotation
     * of the left behind particle */
    const force = emitter.behaviours.find((behaviour: any) => behaviour.type === 'Force')
    const forward = new THREE.Vector3(0, 0, 1)
    forward.applyQuaternion(playerRotation)
    forward.normalize()
    forward.multiplyScalar(-100000)
    force.force = forward

    emitter.position.copy(adjustedPosition)
  })

  const TWIN_SHOT_SPEED = 20
  window.renderer.addEvent('twin-shot', (deltaTimeInSeconds: number) => {
    nebulaSystem.emitters.forEach((emitter: any) => {
      const trajectoryVector: Vector3 = intersectPoint.clone().sub(emitter.position)
      if (trajectoryVector.length() < 0.1) {
        window.renderer.removeEvent('twin-shot')
        nebulaSystem.destroy()
        return
      }
      trajectoryVector.normalize()
      trajectoryVector.multiplyScalar(deltaTimeInSeconds * TWIN_SHOT_SPEED)
      emitter.position.add(trajectoryVector)
    })
    nebulaSystem.update()
  })
}
