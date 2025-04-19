import { createFairyDustObjects } from '@/entity/FairyDust.ts'
import useUser from '@/use/useUser.ts'
import { MAX_ROTATION_SPEED, MIN_CHARGE_SPEED } from '@/utils/constants.ts'
import $ from '@/global'
import { TUTORIALS } from '@/utils/enums.ts'
import { createRayTrace, remap } from '@/utils/function.ts'
import { createShotVFX } from '@/utils/vfx.ts'
import { Object3D, Vector3 } from 'three'
import * as THREE from 'three'

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  singleton = {}

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2($.controls.mouse.crosshairX, $.controls.mouse.crosshairY)
  const { tutorialPhase, userTutorialsDoneMap } = useUser()
  let wasOverchargedTutorialShown = false

  const damageSelf = (entity: any) => {
    entity.dealDamage(entity, entity.currentSpell.damage * entity.currentSpell.buff.value * 0.5)

    if (userTutorialsDoneMap.value[TUTORIALS.OVERCHARGED] || wasOverchargedTutorialShown || entity.guild !== 'guild-0')
      return
    tutorialPhase.value = TUTORIALS.OVERCHARGED
    wasOverchargedTutorialShown = true
  }

  singleton.assessDamage = (entity: any, intersect: any, rotationSpeed: number) => {
    const dmg = entity.currentSpell.damage * entity.currentSpell.buff.value
    const damage: number = +remap(MIN_CHARGE_SPEED, MAX_ROTATION_SPEED, dmg * 0.1, dmg, rotationSpeed).toFixed(1)

    const entityId: string | undefined = intersect?.object?.entityId || intersect?.object?.parent?.entityId
    /* find intersected target and deal damage */
    if (entityId && entityId !== `${entity.uuid}`) {
      const hitTarget: any = [$.player, $.enemy].find((character: any) => {
        return character.uuid === entityId
      })
      if (hitTarget) {
        hitTarget.stateMachine.setState('hit')
        const dmg = hitTarget.defense.buff.value * damage
        hitTarget.dealDamage(hitTarget, dmg)
        hitTarget.guild === 'guild-1' && createFairyDustObjects(rotationSpeed, hitTarget.position)
        console.log('%c unit hit: ', 'color: red', dmg)
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
    if (entity.guild === 'guild-0') {
      raycaster.setFromCamera(pointer, $.camera)
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

    const objectsToIntersect = $.scene.children.filter((child: Object3D) => {
      return !child.name.startsWith('vfx-') // Exclude the particlesGroup by name
    })
    const intersects = raycaster.intersectObjects(objectsToIntersect, true)

    if (intersects.length === 0) {
      if (entity.guild === 'guild-0') {
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
    const intersect = intersects.find((inter: any) => {
      const entityId: string | undefined = inter.object?.parent?.entityId
      const isColliderBox = inter.object?.name === 'colliderBox' && entity.uuid !== inter.object?.entityId
      return (
        // !ignoredObjectTypes.includes(inter.object.type) &&
        // !ignoredObjectNames.includes(inter.object.name) /*
        //  */ &&
        isColliderBox || (entityId && entityId !== `${entity.uuid}`) || inter.object?.entityType === 'level'
      )
    })
    if (intersect?.point) {
      createRayTrace(intersect.point)

      intersect.object.type !== 'SkinnedMesh' &&
        intersect.object.name !== 'WaterArena' &&
        intersect.object.name !== 'colliderBox' /*
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
