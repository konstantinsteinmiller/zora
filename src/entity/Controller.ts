import arena from '@/Arena.ts'
import AssetLoader from '@/engine/AssetLoader.ts'
import type { Guild } from '@/types/entity.ts'
import useUser from '@/use/useUser.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import { createEntityColliderBox, createRigidBodyEntity } from '@/utils/physics.ts'
import { isPlayerInPoisonCloud } from '@/vfx/poison-cloud-sprite.ts'
import { Object3D, Quaternion, Vector3 } from 'three'
import state from '@/states/GlobalState.ts'
import { statsUtils, controllerUtils, getBaseStats } from '@/utils/controller.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'

interface ControllerProps {
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
}

const Controller = ({ modelPath, startPosition, startRotation, modelHeight, stats = {}, guild }: ControllerProps) => {
  let entity: any | Object3D = null
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)

  entity = {
    ...new Object3D(),
    position: startPosition.clone(),
    ...getBaseStats(),
    ...stats,
    ...statsUtils(),
    ...controllerUtils(),
    guild,
    mesh,
    halfHeight: modelHeight * 0.5,
  }

  let mixer: any = {}
  const animationsMap: any = {}
  const stateMachine = new CharacterFSM(animationsMap, entity)
  entity.stateMachine = stateMachine
  entity.currentVelocity = new Vector3(0, 0, 0)

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

  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity({ position: startPosition, entity })
    entity.rigidBody = rigidBody
    entity.collider = collider

    // only enemy has startRotation, player is rotated with camera phi and theta
    startRotation && entity.rigidBody.setRotation(startRotation)
  }

  loadModels()
  initPhysics()

  const updatePosition = (deltaS: number) => {
    const movementVector = calcRapierMovementVector(entity, entity.currentVelocity, deltaS)
    entity.rigidBody.setNextKinematicRotation(entity.getRotation())
    entity.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -entity.halfHeight, 0).add(entity.rigidBody.translation())
    // Update Three.js Mesh Position
    entity.position.copy(meshPos)
    mesh.position.copy(meshPos)
    entity.center = entity.calcHalfHeightPosition(entity)
  }

  const checkIsCharacterDead = () => {
    if (entity.isDead(entity)) {
      entity.die(entity)
      state.isBattleOver = true
      return
    }
    if (state.level.name.toLowerCase().includes('arena') && entity.position.y < -15) {
      entity.dealDamage(entity, entity.hp)
    }
  }

  entity.checkBattleOver = (updateEventUuid: string) => {
    if (state.isBattleOver) {
      state.removeEvent('renderer.update', updateEventUuid)
    }
  }

  const { userSoundVolume } = useUser()
  let soundCounter = 1
  const checkPoisonCloud = () => {
    soundCounter++
    const playerPosition = entity.position
    if (isPlayerInPoisonCloud(playerPosition)) {
      entity.dealDamage(entity, 0.1)
      soundCounter % 160 === 0 &&
        state.sounds.addAndPlayPositionalSound(entity, 'cough', { volume: 0.5 * userSoundVolume.value * 0.25 })
    }
  }

  entity.update = (deltaS: number) => {
    if (!mesh || stateMachine.currentState === null) {
      return false
    }

    checkIsCharacterDead()

    updatePosition(deltaS)

    mixer?.update?.(deltaS)

    checkPoisonCloud()

    return true
  }

  return entity
}

export default Controller
