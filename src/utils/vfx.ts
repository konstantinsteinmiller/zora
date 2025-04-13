import useUser from '@/use/useUser.ts'
import { EventEmitter } from 'events'
import * as THREE from 'three'
import { Vector3 } from 'three'
import System, { GPURenderer } from 'three-nebula'
import $ from '@/global'

import ShotVFX from '@/vfx/shot.json'
import DeathStarVFX from '@/vfx/death-star.json'
import ChargeVFX from '@/vfx/charge.json'
import shimmeringSphereVFX from '@/vfx/shimmering-sphere.json'
import fleeOrbVFX from '@/vfx/flee-orb.json'
import { v4 } from 'uuid'

export type VFXType = 'shot' | 'deathStar' | 'charge' | 'shimmeringSphere' | 'fleeOrb'
const vfxMap: { [key: string]: any } = {
  shot: ShotVFX,
  deathStar: DeathStarVFX,
  charge: ChargeVFX,
  shimmeringSphere: shimmeringSphereVFX,
  fleeOrb: fleeOrbVFX,
}

export const destroyVfx = ({ nebulaSystem, vfxRenderer }: { vfxRenderer: GPURenderer; nebulaSystem: any }) => {
  if (vfxRenderer) {
    vfxRenderer?.forceContextLoss?.()
    vfxRenderer.destroy()
    vfxRenderer?.dispose?.()
    nebulaSystem?.destroy?.()
    nebulaSystem = null

    $.vfxList = $.vfxList.filter(({ name }: any) => name !== vfxRenderer.vfxName)
    // console.log(JSON.stringify($.vfxList, undefined, 2))
  }
}

interface CreateVFXProps {
  position: Vector3
  vfxName: VFXType
  removeOnDeath?: boolean
  onFinished?: () => void
  options?: {
    depthTest: boolean
  }
}

export const createVFX = async ({
  vfxName,
  position,
  removeOnDeath = true,
  onFinished,
  options,
}: CreateVFXProps): Promise<{ nebulaSystem: any; emitter: any }> => {
  const emitter = new EventEmitter()
  const vfx = vfxMap[vfxName]
  if (!vfx) {
    console.error(`VFX not found: ${vfxName}`)
    return Promise.reject({ eventUuid: '', nebulaSystem: null })
  }

  const system = await System.fromJSONAsync(vfx.particleSystemState, THREE)
  // const nebulaRenderer = new SpriteRenderer($.scene, THREE)
  const vfxRenderer = new GPURenderer($.scene, THREE)
  vfxRenderer.vfxName = `${vfxName}_${v4()}`
  const nebulaSystem = system.addRenderer(vfxRenderer)
  nebulaSystem.depthTest = options?.depthTest || false

  $.vfxList.push({ name: vfxRenderer.vfxName, vfxRenderer: vfxRenderer, vfxSystem: nebulaSystem })

  nebulaSystem.emitters.forEach((emitter: any) => {
    emitter.position.copy(position as Vector3)
  })

  let hasRemovedSystem = false
  const eventUuid = $.addEvent(`renderer.update`, () => {
    nebulaSystem.update()
    /* if all emitters are dead remove the vfx */
    if (removeOnDeath && nebulaSystem.emitters.every((emitter: any) => emitter.dead)) {
      setTimeout(() => {
        if (hasRemovedSystem) return
        onFinished?.()
        $.removeEvent(`renderer.update`, eventUuid)
        destroyVfx({ nebulaSystem, vfxRenderer })
        hasRemovedSystem = true
      }, 1000)
    }
  })

  const cleanup = () => {
    $.removeEvent(`renderer.update`, eventUuid)
    destroyVfx({ nebulaSystem, vfxRenderer })
  }
  emitter.on('cleanup', cleanup)
  $.addEvent('level.cleanup', cleanup)

  return Promise.resolve({ nebulaSystem, emitter })
}

export const createShotVFX = async (
  intersect: any,
  entity: any,
  directionN: Vector3,
  hitCallback: () => void = () => {}
) => {
  const { userSoundVolume } = useUser()
  const adjustedPosition = entity.mesh?.position?.clone?.() || new Vector3(0, 0, 0)
  adjustedPosition.y += 1

  const system = await System.fromJSONAsync(ShotVFX.particleSystemState, THREE)
  // const nebulaRenderer = new SpriteRenderer($.scene, THREE)
  const vfxRenderer = new GPURenderer($.scene, THREE)
  vfxRenderer.vfxName = `shot_${v4()}`

  const nebulaSystem = system.addRenderer(vfxRenderer)
  $.vfxList.push({ name: vfxRenderer.vfxName, vfxRenderer: vfxRenderer, vfxSystem: nebulaSystem })

  const forceMagnitude = 10000
  const forceDirection = directionN.clone().negate().normalize().multiplyScalar(forceMagnitude)

  nebulaSystem.emitters.forEach((emitter: any) => {
    /* adjust the force field of the emitters to get proper rotation
     * of the left behind particle */
    const forceBehaviour = emitter.behaviours.find((behaviour: any) => behaviour.type === 'Force')
    if (forceBehaviour) {
      forceBehaviour.force.x = forceDirection.x
      forceBehaviour.force.y = forceDirection.y
      forceBehaviour.force.z = forceDirection.z
    }

    emitter.position.copy(adjustedPosition)
  })

  const SHOT_SPEED = 100
  let eventUuid: string = ''
  let hasAppliedCallbackOnce = false

  $.sounds.addAndPlayPositionalSound(entity, 'spellShot', { volume: 0.5 * userSoundVolume.value * 0.25 })

  let wasSpellRemoved: boolean = false

  eventUuid = $.addEvent(`renderer.update`, (deltaS: number) => {
    nebulaSystem.emitters.forEach((emitter: any) => {
      const isLevel = intersect.object?.entityType === 'level'
      let destinationPoint = new Vector3()

      if (isLevel) {
        destinationPoint.copy(intersect.point)
      } else {
        if (!intersect.object?.parent) {
          destinationPoint.copy(intersect.point)
        } else {
          destinationPoint = intersect.object?.parent?.position.clone()
          destinationPoint.y += entity.halfHeight || 0
        }
      }
      const distToTarget = destinationPoint.distanceTo(emitter.position)

      if (distToTarget < 0.7) {
        if (!hasAppliedCallbackOnce) {
          hitCallback()
          hasAppliedCallbackOnce = true
        }

        /* remove force */
        const forceBehaviour = emitter.behaviours.find((behaviour: any) => behaviour.type === 'Force')
        if (forceBehaviour) {
          forceBehaviour.force.x = 0
          forceBehaviour.force.y = 0
          forceBehaviour.force.z = 0
        }

        /* let the impacted spell sit for a while to see where you hit */

        setTimeout(() => {
          if (wasSpellRemoved) return
          $.removeEvent('renderer.update', eventUuid)
          destroyVfx({ nebulaSystem, vfxRenderer })
          wasSpellRemoved = true
        }, 2000)
        return
      }

      const trajectoryVector: Vector3 = destinationPoint.clone().sub(emitter.position).normalize()
      const factor = distToTarget < 1 ? 0.4 : 1
      const movementDistance = deltaS * SHOT_SPEED * factor
      const movementVector: Vector3 = trajectoryVector.multiplyScalar(movementDistance)

      emitter.position.add(movementVector)
    })
    nebulaSystem.update()
  })
}
