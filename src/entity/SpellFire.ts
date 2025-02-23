import { MAX_ROTATION_SPEED } from '@/enums/constants.ts'
import state from '@/states/GlobalState.ts'
import { createRayTrace } from '@/utils/function.ts'
import { createTwinShotVFX } from '@/utils/vfx.ts'
import * as THREE from 'three'

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  singleton = {}

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(state.controls.mouse.current.crosshairX, state.controls.mouse.current.crosshairY)

  const damageSelf = (entity: any) => {
    entity.dealDamage(entity, entity.currentSpell.damage * 0.5)
  }

  singleton.fireRaycaster = (rotationSpeed: number, entity: any, target: any) => {
    if (rotationSpeed >= MAX_ROTATION_SPEED) {
      damageSelf(entity)
      entity.stateMachine.setState('hit')
      return
    }
    entity.stateMachine.setState('cast')
    if (entity.name === 'player') {
      raycaster.setFromCamera(pointer, state.camera)
    } else {
      const origin = entity.mesh.position.clone()
      origin.y += entity.halfHeight + 0.1
      origin.z -= 0.7
      const targetPosition = target.mesh.position.clone()
      origin.y += entity.halfHeight + 0.1
      raycaster.set(origin, targetPosition)
    }

    const intersects = raycaster.intersectObjects(state.scene.children, true)

    if (intersects.length === 0) {
      return
    }

    const intersect = intersects.find(inter => {
      return inter.object.type !== 'AxesHelper' && inter.object.type !== 'LineSegments'
    })
    // const object = intersect.object
    // console.log('intersect object:', object.name, intersect, intersect?.point)
    if (intersect?.point) {
      createRayTrace(intersect.point)
      createTwinShotVFX(intersect.point, entity)
    }
  }

  return singleton
}
