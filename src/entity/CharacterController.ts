import AssetLoader from '@/engine/AssetLoader.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { statsUtils, controllerUtils, getBaseStats, chargeUtils } from '@/utils/controller.ts'
import { createEntityColliderBox, createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, Quaternion, Vector3 } from 'three'
import * as THREE from 'three'
import InputController from '@/control/KeyboardController.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState'

let entity: any = null

const CharacterController = ({
  modelPath,
  stats = {},
  startPosition,
  modelHeight = 1.8,
}: {
  modelPath: string
  stats: any
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
}) => {
  if (entity !== null) {
    return entity
  }

  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const halfHeight = modelHeight * 0.5

  const chargeUtilsObj = chargeUtils()
  entity = {
    ...new Object3D(),
    ...getBaseStats(),
    ...stats,
    ...controllerUtils(),
    ...statsUtils(),
    // ...characterCleanupUtils(),
    ...{
      updateChargeIndicator: chargeUtilsObj.updateChargeIndicator,
      createChargeIndicator: chargeUtilsObj.createChargeIndicator,
      destroyChargeIndicatorVFX: chargeUtilsObj.destroyChargeIndicatorVFX,
    },
    mesh: mesh,
    halfHeight,
  }
  // console.log('entity: ', entity)
  entity.currentSpell.speed = state.isDebug ? 8 : 3
  entity.currentSpell.damage = state.isDebug ? 300 : 40
  // entity.currentSpell.speed = undefined

  entity.getPosition = () => {
    if (!mesh) {
      return new Vector3(0, 0, 0)
    }
    return mesh?.position
  }
  entity.getRotation = () => {
    return mesh.quaternion
  }
  entity.setRotation = (rotation: THREE.Quaternion) => {
    if (!mesh) {
      return
    }
    const prevQuat = mesh.quaternion.clone()
    prevQuat.slerp(rotation, 0.2) // Smooth interpolation
    entity.rigidBody.setRotation(prevQuat)
    return mesh.quaternion.copy(prevQuat)
  }

  InputController()
  let mixer: any = {}
  const animationsMap: any = {}
  const decceleration = new Vector3(-5.0, -0.0001, -5.0)
  const acceleration = new Vector3(1, 0.25, 15.0)
  const currentVelocity = new Vector3(0, 0, 0)

  const stateMachine = new CharacterFSM(animationsMap, entity)
  entity.stateMachine = stateMachine

  const loadModels = async () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    await loadCharacterModelWithAnimations({
      modelPath,
      parent: state.scene,
      position: startPosition,
      scale: 0.01,
      stateMachine,
      animationsMap,
      animationNamesList: characterAnimationNamesList,
      callback: (scope: any) => {
        mixer = scope.mixer
        mesh = scope.mesh
        mesh.entityId = `${entity.uuid}`
        entity.mesh = mesh

        entity.center = entity.calcHalfHeightPosition(entity)
        createEntityColliderBox(entity)
      },
    })
  }
  loadModels()

  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity({ position: startPosition, entity })
    entity.rigidBody = rigidBody
    entity.collider = collider
  }
  initPhysics()

  const calcVelocityAndRotation = (velocity: Vector3, deltaS: number) => {
    const frameDecceleration = new Vector3(
      velocity.x * decceleration.x,
      velocity.y * decceleration.y,
      velocity.z * decceleration.z
    )
    frameDecceleration.multiplyScalar(deltaS)
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const acc = acceleration.clone()
    if (state.controls.sprint) {
      acc.multiplyScalar(2.0)
    }

    const stopStates = ['cast', 'hit']
    if (stopStates.includes(stateMachine.currentState.name)) {
      acc.multiplyScalar(0.0)
    }

    if (stateMachine.currentState.name === 'jump' && !state.controls.sprint) {
      acc.multiplyScalar(1.5)
    }

    if (state.controls.forward) {
      velocity.z += acc.z * deltaS
    }
    if (state.controls.backward) {
      velocity.z -= acc.z * deltaS
    }
    const strafeVelocity = (state.controls.left ? 1 : 0) + (state.controls.right ? -1 : 0)
    velocity.x += 12 * acc.x * strafeVelocity * deltaS

    return { velocity }
  }

  let updateEventUuid = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    if (!mesh || stateMachine.currentState === null) {
      return
    }
    stateMachine.update(deltaS, state.controls)

    if (entity.isDead(entity)) {
      state.removeEvent('renderer.update', updateEventUuid)
      entity.die(entity)

      state.isBattleOver = true
      return
    }
    entity.stop()

    entity.updateEndurance(entity, deltaS, elapsedTimeInS)

    const { velocity } = calcVelocityAndRotation(currentVelocity, deltaS)

    const movementVector = calcRapierMovementVector(entity, velocity, deltaS)

    /* apply rotation and translation to physical body */
    entity.rigidBody.setNextKinematicRotation(entity.getRotation())
    entity.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -entity.halfHeight, 0).add(entity.rigidBody.translation())
    /* Update Three.js Mesh Position */
    entity.position.copy(meshPos)
    mesh.position.copy(meshPos)
    entity.center = entity.calcHalfHeightPosition(entity)

    mixer?.update?.(deltaS)

    entity.updateLife(entity, elapsedTimeInS)
  }

  entity.start = () => {
    updateEventUuid = state.addEvent('renderer.update', update)
  }
  entity.stop = () => {
    if (state.isBattleOver) {
      state.removeEvent('renderer.update', updateEventUuid)
    }
  }

  state.addEvent('arena.cleanup', () => {
    entity = null
    state.player = null
  })

  state.entitiesMap.set(entity.mesh.entityUuid, entity)
  state.player = entity
  return entity
}
export default CharacterController
