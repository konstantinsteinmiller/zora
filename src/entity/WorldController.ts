import Controller from '@/entity/Controller.ts'
import FairyController from '@/entity/FairyController.ts'
import type { Guild } from '@/types/entity.ts'
import { type ANIM, worldCharacterAnimationNamesList } from '@/utils/constants.ts'
import { controllerUtils } from '@/utils/controller.ts'
import { LEVELS } from '@/utils/enums.ts'
import { Quaternion, Vector3 } from 'three'

interface WorldControllerProps {
  id?: string
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
  animationNamesList?: ANIM[]
}

const WorldController = ({
  id,
  modelPath,
  startPosition,
  startRotation,
  modelHeight,
  stats = {},
  guild,
  animationNamesList,
}: WorldControllerProps) => {
  const entity: any = Controller({
    id,
    modelPath,
    startPosition,
    startRotation,
    modelHeight,
    stats,
    guild,
    levelType: LEVELS.WORLD,
    animationNamesList: animationNamesList || worldCharacterAnimationNamesList,
  })
  const utils: any = {
    /*...statsUtils(),*/ ...controllerUtils(),
  }
  for (const key in utils) {
    entity[key] = utils[key]
  }

  const controllerUpdate = entity.update
  entity.update = (deltaS: number) => {
    const isFinished = controllerUpdate(deltaS)
    if (!isFinished) return false

    return true
  }

  return entity
}

export default WorldController
