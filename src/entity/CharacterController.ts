import AssetLoader from '@/engine/AssetLoader.ts'
import { createPlayerMovementStrategy } from '@/entity/MovementStrategy.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { statsUtils, controllerUtils, getBaseStats, chargeUtils } from '@/utils/controller.ts'
import { createEntityColliderBox, createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, Quaternion, Vector3 } from 'three'
import * as THREE from 'three'
import InputController from '@/control/KeyboardController.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState'

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
  let entity: any = null
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

  InputController(entity)
  let mixer: any = {}
  const animationsMap: any = {}
  entity.currentVelocity = new Vector3(0, 0, 0)

  const stateMachine = new CharacterFSM(animationsMap, entity)
  entity.stateMachine = stateMachine
  const movementStrategy = createPlayerMovementStrategy()

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

  const checkIsCharacterDead = () => {
    if (entity.isDead(entity)) {
      entity.die(entity)
      state.isBattleOver = true
      return
    }
  }

  const updatePosition = (deltaS: number) => {
    const movementVector = calcRapierMovementVector(entity, entity.currentVelocity, deltaS)

    /* apply rotation and translation to physical body */
    entity.rigidBody.setNextKinematicRotation(entity.getRotation())
    entity.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -entity.halfHeight, 0).add(entity.rigidBody.translation())
    /* Update Three.js Mesh Position */
    entity.position.copy(meshPos)
    mesh.position.copy(meshPos)
    entity.center = entity.calcHalfHeightPosition(entity)
  }

  let updateEventUuid = ''
  const update = (deltaS: number /*, elapsedTimeInS: number*/) => {
    if (!mesh || stateMachine.currentState === null) {
      return
    }
    stateMachine.update(deltaS, state.controls)

    checkIsCharacterDead()

    entity.checkBattleOver(updateEventUuid)

    entity.currentVelocity = movementStrategy.calculateVelocity(entity, deltaS, state.controls)

    updatePosition(deltaS)

    mixer?.update?.(deltaS)

    entity.regenEndurance(entity, deltaS)
    // entity.updateLife(entity, elapsedTimeInS)
  }

  entity.start = () => {
    updateEventUuid = state.addEvent('renderer.update', update)
  }

  entity.checkBattleOver = (updateEventUuid: string) => {
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
