import Controller from '@/entity/Controller.ts'
import type { Guild } from '@/types/entity.ts'
import { controllerUtils } from '@/utils/controller.ts'
import { LEVELS } from '@/utils/enums.ts'
import { Quaternion, Vector3 } from 'three'

interface WorldControllerProps {
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
}

const WorldController = ({
  modelPath,
  startPosition,
  startRotation,
  modelHeight,
  stats = {},
  guild,
}: WorldControllerProps) => {
  const entity: any = Controller({
    modelPath,
    startPosition,
    startRotation,
    modelHeight,
    stats,
    guild,
    levelType: LEVELS.WORLD,
  })
  const utils: any = {
    /*...statsUtils(),*/ ...controllerUtils(),
  }
  for (const key in utils) {
    entity[key] = utils[key]
  }

  // const checkIsCharacterDead = () => {
  //   if (entity.isDead(entity)) {
  //     entity.die(entity)
  //     $.isBattleOver = true
  //     return
  //   }
  //   if (entity.position.y < -15) {
  //     entity.dealDamage(entity, entity.hp)
  //   }
  // }

  const controllerUpdate = entity.update
  entity.update = (deltaS: number) => {
    const isFinished = controllerUpdate(deltaS)
    if (!isFinished) return false

    return true
  }

  return entity
}

export default WorldController
