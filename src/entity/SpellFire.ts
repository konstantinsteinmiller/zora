import { MAX_ROTATION_SPEED } from '@/enums/constants.ts'
import state from '@/states/GlobalState.ts'
import { createRayTrace } from '@/utils/function.ts'
import { createShotVFX } from '@/utils/vfx.ts'
import { Vector3 } from 'three'
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

    let directionN: Vector3 = new Vector3()
    if (entity.name === 'player') {
      raycaster.setFromCamera(pointer, state.camera)
    } else {
      const origin = entity.mesh.position.clone()
      origin.y += entity.halfHeight + 0.1
      origin.z -= 0.9
      const targetPosition = target.mesh.position.clone()
      origin.y += target.halfHeight + 0.1

      directionN = new Vector3().subVectors(targetPosition, origin).normalize()
      raycaster.set(origin, directionN)
    }

    const intersects = raycaster.intersectObjects(state.scene.children, true)

    if (intersects.length === 0) {
      return
    }

    const intersect = intersects.find(inter => {
      return inter.object.type !== 'AxesHelper' && inter.object.type !== 'Points' && inter.object.type !== 'LineSegments' && inter.object.type !== 'Line' && inter.object?.parent?.entityId !== `${entity.uuid}::mesh`
    })
    if (intersect?.point) {
      createRayTrace(intersect.point)
      console.log('intersect: ', intersect.object)
      createShotVFX(intersect, entity, directionN)
    }
  }

  return singleton
}
