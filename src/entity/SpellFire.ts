import state from '@/states/GlobalState.ts'
import { createRayTrace } from '@/utils/function.ts'
import { createTwinShotVFX } from '@/utils/vfx.ts'
import * as THREE from 'three'

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  singleton = {}

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(state.input.current.crosshairX, state.input.current.crosshairY)

  const damageSelf = () => {
    state.player.hp -= state.player.currentSpell.damage
  }

  singleton.fireRaycaster = (rotationSpeed: number) => {
    if (rotationSpeed === 0.08) {
      damageSelf()
      return
    }
    state.player.stateMachine.setState('cast')
    raycaster.setFromCamera(pointer, state.camera)
    const intersects = raycaster.intersectObjects(state.scene.children, true)

    if (intersects.length === 0) {
      return
    }

    const intersect = intersects.find(inter => {
      return inter.object.type !== 'AxesHelper'
    })
    // const object = intersect.object
    // console.log('intersect object:', object.name, intersect, intersect?.point)
    if (intersect?.point) {
      createRayTrace(intersect.point, intersect.distance)
      createTwinShotVFX(intersect.point)
    }
  }

  return singleton
}
