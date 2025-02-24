import renderer from '@/engine/Renderer.ts'
import * as THREE from 'three'
import { Vector3 } from 'three'
import System, { SpriteRenderer, GPURenderer } from 'three-nebula'
import state from '@/states/GlobalState'

// import TwinShot from '@/vfx/twin-shot_2.json'
import ShotVFX from '@/vfx/shot.json'

export const createShotVFX = async (intersect: any, entity: any, directionN: Vector3) => {
  const adjustedPosition = entity.getPosition().clone()
  adjustedPosition.y += 1
  // adjustedPosition.x += 0.9

  const system = await System.fromJSONAsync(ShotVFX.particleSystemState, THREE)
  // const nebulaRenderer = new SpriteRenderer(state.scene, THREE)
  const nebulaRenderer = new GPURenderer(state.scene, THREE)
  const nebulaSystem = system.addRenderer(nebulaRenderer)

  nebulaSystem.emitters.forEach((emitter: any) => {
    /* adjust the force field of the emitters to get proper rotation
     * of the left behind particle */
    const gravity = emitter.behaviours.find((behaviour: any) => behaviour.type === 'Gravity')
    if (gravity) {
      const dir = directionN.multiplyScalar(100)
      gravity.acceleration.set(dir.x, dir.y, dir.z) // Removes gravity effect
    }

    emitter.position.copy(adjustedPosition)
  })

  const TWIN_SHOT_SPEED = 100
  let eventUuid: string = ''

  eventUuid = state.addEvent(`renderer.update`, (deltaS: number) => {
    nebulaSystem.emitters.forEach((emitter: any) => {
      const trajectoryVector: Vector3 = intersect.point.clone().sub(emitter.position)
      const dist = intersect.point.distanceTo(emitter.position)
      if (dist < 0.2) {
        const entityId: string | undefined = intersect?.object?.parent?.entityId
        if (entityId && entityId !== `${entity.uuid}::mesh`) {
          const hitTarget: any = [state.player, state.enemy].find((character: any) => {
            const targetUuid = entityId.split('::')[0]
            return character.uuid === targetUuid
          })
          if (hitTarget) {
            hitTarget.dealDamage(hitTarget, entity.currentSpell.damage)
            console.log('%c enemy hit: ', 'color: red')
          }
        }
        /* let the impacted spell sit for a while to see where you hit */
        state.removeEvent(`renderer.update`, eventUuid)
        setTimeout(() => {
          nebulaSystem.destroy()
        }, 2000)
        return
      }

      const factor = dist < 1 ? 0.4 : 1
      trajectoryVector.normalize()
      trajectoryVector.multiplyScalar(deltaS * TWIN_SHOT_SPEED * factor)

      const force = emitter.behaviours.find((behaviour: any) => behaviour.type === 'Force')
      if (force) {
        force.force = directionN.multiplyScalar(-100)
      }

      emitter.position.add(trajectoryVector)
    })
    nebulaSystem.update()
  })
}
