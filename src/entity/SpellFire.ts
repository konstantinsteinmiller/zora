import { MAX_ROTATION_SPEED, MIN_CHARGE_SPEED } from '@/enums/constants.ts'
import state from '@/states/GlobalState.ts'
import { createRayTrace, remap } from '@/utils/function.ts'
import { createShotVFX } from '@/utils/vfx.ts'
import { Vector3 } from 'three'
import * as THREE from 'three'

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  singleton = {}

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(state.controls.mouse.crosshairX, state.controls.mouse.crosshairY)

  const damageSelf = (entity: any) => {
    entity.dealDamage(entity, entity.currentSpell.damage * 0.5)
  }

  singleton.assessDamage = (entity: any, intersect: any, rotationSpeed: number) => {
    const damage: number = +remap(MIN_CHARGE_SPEED, MAX_ROTATION_SPEED, entity.currentSpell.damage * 0.1, entity.currentSpell.damage, rotationSpeed).toFixed(1)

    const entityId: string | undefined = intersect?.object?.parent?.entityId
    /* find intersected target and deal damage */
    if (entityId && entityId !== `${entity.uuid}`) {
      const hitTarget: any = [state.player, state.enemy].find((character: any) => {
        return character.uuid === entityId
      })
      if (hitTarget) {
        hitTarget.stateMachine.setState('hit')
        hitTarget.dealDamage(hitTarget, damage)
        console.log('%c enemy hit: ', 'color: red', damage)
      }
    }
  }

  singleton.fireRaycaster = (rotationSpeed: number, entity: any, target: any) => {
    if (rotationSpeed >= MAX_ROTATION_SPEED) {
      damageSelf(entity)
      entity.stateMachine.setState('hit')
      return
    }
    // entity.stateMachine.setState('cast')
    let directionN: Vector3 = new Vector3()
    if (entity.name === 'player') {
      raycaster.setFromCamera(pointer, state.camera)
      directionN = raycaster.ray.direction
    } else {
      const origin = entity.mesh.position.clone()
      origin.y += entity.halfHeight + 0.1
      origin.z -= 0.9
      const targetPosition = target.mesh.position.clone()
      targetPosition.y += target.halfHeight + 0.1

      directionN = new Vector3().subVectors(targetPosition, origin).normalize()
      raycaster.set(origin, directionN)
    }

    const intersects = raycaster.intersectObjects(state.scene.children, true)

    if (intersects.length === 0) {
      if (entity.name === 'player') {
        /* no object intersected, shoot into the air */
        const directionN = raycaster.ray.direction
        const point = entity.mesh.position.clone().add(directionN.clone().multiplyScalar(200))
        createShotVFX({ point: point, object: { entityType: 'level' } }, entity, directionN)
      }
      return
    }

    // const ignoredObjectTypes = ['AxesHelper', 'Points', 'LineSegments', 'Line']
    // const ignoredObjectNames = ['rayTrace']
    /* find only SkinnedMesh of the characterController and enemyController */
    const intersect = intersects.find(inter => {
      const entityId: string | undefined = inter.object?.parent?.entityId
      return (
        // !ignoredObjectTypes.includes(inter.object.type) &&
        // !ignoredObjectNames.includes(inter.object.name) /*
        //  */ &&
        (entityId && entityId !== `${entity.uuid}`) || inter.object?.entityType === 'level'
      )
    })
    if (intersect?.point) {
      createRayTrace(intersect.point)

      intersect.object.type !== 'SkinnedMesh' &&
        intersect.object.name !== 'WaterArena' /*
         */ &&
        console.log('intersect: ', intersect.object)

      createShotVFX(intersect, entity, directionN, () => {
        singleton.assessDamage(entity, intersect, rotationSpeed)
      })
      return
    }
  }

  return singleton
}
