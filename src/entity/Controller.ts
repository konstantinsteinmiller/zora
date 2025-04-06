import AssetLoader from '@/engine/AssetLoader.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import type { Guild, LevelType } from '@/types/entity.ts'
import useOctree from '@/use/useOctree.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { type ANIM } from '@/utils/constants.ts'
import { LEVELS } from '@/utils/enums.ts'
import { createEntityColliderBox, createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, Quaternion, Vector3 } from 'three'
import $ from '@/global'
import { getBaseStats } from '@/utils/controller.ts'
import ArenaCharacterFSM from '@/states/ArenaCharacterFSM.ts'

interface ControllerProps {
  id?: string
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
  levelType: LevelType
  animationNamesList: ANIM[]
}

const Controller = ({
  id,
  modelPath,
  startPosition,
  modelHeight,
  stats = {},
  guild,
  levelType,
  animationNamesList,
}: ControllerProps) => {
  let entity: any | Object3D = null
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const { addEntity } = useOctree()

  entity = {
    ...new Object3D(),
    id,
    position: startPosition.clone(),
    ...getBaseStats(),
    ...stats,
    guild,
    mesh,
    animationNamesList,
    halfHeight: modelHeight * 0.5,
  }

  let mixer: any = {}
  const animationsMap: any = {}
  const stateMachine =
    levelType === LEVELS.ARENA ? new ArenaCharacterFSM(animationsMap, entity) : new CharacterFSM(animationsMap, entity)

  // const animationNamesList = levelType === LEVELS.ARENA ? characterAnimationNamesList : worldCharacterAnimationNamesList
  entity.stateMachine = stateMachine
  entity.currentVelocity = new Vector3(0, 0, 0)

  entity.playAnimation = (name: string) => {
    if (entity.stateMachine.currentState) {
      entity.stateMachine.setState(name)
    }
  }

  const loadModels = async () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    await loadCharacterModelWithAnimations({
      modelPath,
      parent: $.scene,
      position: startPosition,
      scale: 0.01,
      stateMachine,
      animationsMap,
      animationNamesList,
      callback: (scope: any) => {
        mixer = scope.mixer
        mesh = scope.mesh
        mesh.entityId = `${entity.uuid}`
        entity.mesh = mesh
        entity.mesh.updateMatrixWorld(true)

        entity.center = entity.calcHalfHeightPosition(entity)
        createEntityColliderBox(entity)

        $.triggerEvent('model.loaded', entity)
      },
    })
  }

  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity({ position: startPosition, entity })
    entity.rigidBody = rigidBody
    entity.collider = collider

    // only enemy has startRotation, player is rotated with camera phi and theta
    // startRotation && entity.rigidBody.setRotation(startRotation)
    // startRotation && entity.rigidBody.setNextKinematicRotation(startRotation)
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

  entity.update = (deltaS: number) => {
    if (!mesh || stateMachine.currentState === null) {
      return false
    }

    updatePosition(deltaS)

    mixer?.update?.(deltaS)

    return true
  }

  return entity
}

export default Controller
