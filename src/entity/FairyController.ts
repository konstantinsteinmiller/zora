import AssetLoader from '@/engine/AssetLoader.ts'
import $ from '@/global'
import FairyCharacterFSM from '@/states/FairyCharacterFSM.ts'
import { INITIAL_ATTACK_BUFF, INITIAL_DEFENSE_BUFF } from '@/Story/config.ts'
import type { Guild } from '@/types/entity.ts'
import { fairyAnimsList } from '@/utils/constants.ts'
import { getBaseStats } from '@/utils/controller.ts'
import { disposeEntity } from '@/utils/world.ts'
import { Object3D, Quaternion, Vector3 } from 'three'

interface FairyControllerProps {
  modelPath: string
  startPosition: Vector3
  modelHeight?: number
  parent?: any
  stats?: any
  guild: Guild
  id: string
}

const FairyController = ({
  modelPath,
  parent,
  modelHeight = 0.2,
  startPosition,
  stats,
  guild,
  id,
}: FairyControllerProps) => {
  let entity: any | Object3D = null
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)

  entity = {
    ...new Object3D(),
    id,
    position: startPosition.clone(),
    ...getBaseStats(),
    ...stats,
    guild,
    mesh,
    animationNamesList: fairyAnimsList,
    halfHeight: modelHeight * 0.5,
    parentController: parent,
  }
  entity.defense = {
    ...INITIAL_DEFENSE_BUFF,
  }
  entity.currentSpell = {
    ...entity.currentSpell,
    ...INITIAL_ATTACK_BUFF,
  }

  entity.getPosition = () => {
    if (!entity.mesh) {
      return new Vector3(0, 0, 0)
    }
    return entity.mesh?.position
  }
  entity.getRotation = () => {
    return entity.mesh.quaternion
  }

  let mixer: any = {}
  const animationsMap: any = {}
  const stateMachine = new FairyCharacterFSM(animationsMap, entity)

  entity.stateMachine = stateMachine

  const loadModels = async () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    await loadCharacterModelWithAnimations({
      modelPath,
      position: startPosition,
      parent: $.scene,
      scale: 0.002,
      animationsMap,
      animationNamesList: fairyAnimsList,
      callback: (scope: any) => {
        mixer = scope.mixer
        mesh = scope.mesh
        mesh.entityId = `${entity.uuid}`
        entity.mesh = mesh

        entity.stateMachine.setState('idle')

        $.triggerEvent('model.loaded', entity)
      },
    })
  }

  loadModels()

  const shoulderOffset = new Vector3(-0.65, 1.5, -0.13)
  const cameraWorldDirection = new Vector3()
  const pointCameraIsLookingAt = new Vector3()

  const rotateFairyInParentDirection = () => {
    const parentWorldPosition = new Vector3()
    parent.mesh.getWorldPosition(parentWorldPosition)

    const parentWorldQuaternion = new Quaternion()
    parent.mesh.getWorldQuaternion(parentWorldQuaternion)

    const desiredLocalOffset = shoulderOffset.clone()
    // Rotate the local offset by the parent's world rotation to get the world offset
    desiredLocalOffset.applyQuaternion(parentWorldQuaternion)
    const targetWorldPosition = new Vector3().addVectors(parentWorldPosition, desiredLocalOffset)
    entity.mesh.position.lerp(targetWorldPosition, 0.05)

    parent.mesh.getWorldDirection(cameraWorldDirection)
    pointCameraIsLookingAt.copy(parent.mesh.position).add(cameraWorldDirection.multiplyScalar(10))
    entity.mesh.lookAt(pointCameraIsLookingAt)

    entity.mesh.updateMatrixWorld(true)
  }

  const attackPlayer = () => {
    /* do attack logic here, fly to player in an arc, show dispel item ui */
  }

  entity.updatePosition = () => {
    if (!entity.mesh) return

    parent?.mesh && rotateFairyInParentDirection()
    !parent && attackPlayer()
  }

  entity.update = (deltaS: number) => {
    if (!entity.mesh || stateMachine.currentState === null || $.loadingManager.isLoading || !$.isWorldInitialized)
      return false

    entity.updatePosition()

    // spraySprinclesAtWorldPosition(entity)

    mixer?.update?.(deltaS)

    return true
  }

  let updateEventUuid = ''

  updateEventUuid = $.addEvent('renderer.update', entity.update)

  entity.dispel = () => {
    disposeEntity(entity)
    cleanup()
  }
  const cleanup = () => {
    updateEventUuid && $.removeEvent('renderer.update', updateEventUuid)
    cleanupUuid && $.removeEvent('level.cleanup', cleanupUuid)
    fairyCleanupUuid && $.removeEvent('fairy.cleanup', fairyCleanupUuid)
    updateEventUuid = ''
    cleanupUuid = ''
    fairyCleanupUuid = ''
    $.entitiesMap.set(entity.uuid, undefined)
  }

  let cleanupUuid = $.addEvent('level.cleanup', cleanup)
  let fairyCleanupUuid = $.addEvent('fairy.cleanup', cleanup)

  $.entitiesMap.set(entity.uuid, entity)

  return entity
}

export default FairyController
