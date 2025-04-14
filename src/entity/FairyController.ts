import AssetLoader from '@/engine/AssetLoader.ts'
import $ from '@/global'
import FairyCharacterFSM from '@/states/FairyCharacterFSM.ts'
import type { Guild } from '@/types/entity.ts'
import { fairyAnimsList } from '@/utils/constants.ts'
import { getBaseStats } from '@/utils/controller.ts'
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

        entity.stateMachine.setState('fly')

        $.triggerEvent('model.loaded', entity)
      },
    })
  }

  loadModels()

  const shoulderOffset = new Vector3(-0.65, 1.5, -0.13)
  const cameraWorldDirection = new Vector3()
  const pointCameraIsLookingAt = new Vector3()
  entity.updatePosition = () => {
    if (!parent?.mesh || !entity.mesh) return

    const parentWorldPosition = new Vector3()
    parent.mesh.getWorldPosition(parentWorldPosition)

    const parentWorldQuaternion = new Quaternion()
    parent.mesh.getWorldQuaternion(parentWorldQuaternion)

    const desiredLocalOffset = shoulderOffset.clone()
    // Rotate the local offset by the parent's world rotation to get the world offset
    desiredLocalOffset.applyQuaternion(parentWorldQuaternion)
    const targetWorldPosition = new Vector3().addVectors(parentWorldPosition, desiredLocalOffset)
    entity.mesh.position.lerp(targetWorldPosition, 0.05)
    // entity.mesh.lookAt($.trainer.mesh.position)

    parent.mesh.getWorldDirection(cameraWorldDirection)
    pointCameraIsLookingAt.copy(parent.mesh.position).add(cameraWorldDirection.multiplyScalar(10))
    entity.mesh.lookAt(pointCameraIsLookingAt)

    entity.mesh.updateMatrixWorld(true)
  }

  entity.update = (deltaS: number) => {
    if (!entity.mesh || stateMachine.currentState === null || $.loadingManager.isLoading || !$.isWorldInitialized)
      return false

    entity.updatePosition()

    mixer?.update?.(deltaS)

    return true
  }

  let updateEventUuid = ''

  updateEventUuid = $.addEvent('renderer.update', entity.update)

  let cleanupUuid = $.addEvent('level.cleanup', () => {
    $.removeEvent('renderer.update', updateEventUuid)
    $.removeEvent('level.cleanup', cleanupUuid)
    updateEventUuid = ''
    cleanupUuid = ''
    fairyCleanupUuid = ''
    $.entitiesMap.set(entity.uuid, undefined)
  })
  let fairyCleanupUuid = $.addEvent('fairy.cleanup', () => {
    updateEventUuid && $.removeEvent('renderer.update', updateEventUuid)
    cleanupUuid && $.removeEvent('level.cleanup', cleanupUuid)
    fairyCleanupUuid && $.removeEvent('fairy.cleanup', fairyCleanupUuid)
    $.entitiesMap.set(entity.uuid, undefined)
  })

  $.entitiesMap.set(entity.uuid, entity)

  return entity
}

export default FairyController
