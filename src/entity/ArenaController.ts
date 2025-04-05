import Controller from '@/entity/Controller.ts'
import type { Guild } from '@/types/entity.ts'
import useUser from '@/use/useUser.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import { LEVELS } from '@/utils/enums.ts'
import { isPlayerInPoisonCloud } from '@/vfx/poison-cloud.ts'
import { Quaternion, Vector3 } from 'three'
import $ from '@/global'
import { statsUtils, controllerUtils } from '@/utils/controller.ts'

interface ArenaControllerProps {
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
}

const ArenaController = ({
  modelPath,
  startPosition,
  startRotation,
  modelHeight,
  stats = {},
  guild,
}: ArenaControllerProps) => {
  const entity: any = Controller({
    modelPath,
    startPosition,
    startRotation,
    modelHeight,
    stats,
    guild,
    levelType: LEVELS.ARENA,
    animationNamesList: characterAnimationNamesList,
  })
  const utils: any = { ...statsUtils(), ...controllerUtils() }
  for (const key in utils) {
    entity[key] = utils[key]
  }

  const checkIsCharacterDead = () => {
    if (entity.isDead(entity)) {
      entity.die(entity)
      $.isBattleOver = true
      return
    }
    if ($.level.name.toLowerCase().includes('arena') && entity.position.y < -15) {
      entity.dealDamage(entity, entity.hp)
    }
  }

  entity.checkBattleOver = (updateEventUuid: string) => {
    if ($.isBattleOver) {
      $.removeEvent('renderer.update', updateEventUuid)
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
        $.sounds.addAndPlayPositionalSound(entity, 'cough', { volume: 0.5 * userSoundVolume.value * 0.25 })
    }
  }

  const controllerUpdate = entity.update
  entity.update = (deltaS: number) => {
    const isFinished = controllerUpdate(deltaS)
    if (!isFinished) return false

    checkIsCharacterDead()

    checkPoisonCloud()

    entity.regenMana(entity, deltaS)

    return true
  }

  return entity
}

export default ArenaController
