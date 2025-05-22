import AIController from '@/entity/AIController.ts'
import ArenaPlayerController from '@/entity/ArenaPlayerController.ts'
import { cleanupLevel } from '@/Game.ts'
import $ from '@/global'
import type { Guild } from '@/types/entity.ts'
import type { Fairy } from '@/types/fairy.ts'
import useFairies from '@/use/useFairies.ts'
import { Vector3 } from 'three'
import World from '@/entity/World'
import Crosshair from '@/entity/Crosshair'

const Arena = async level => {
  World('water-arena', () => {
    const startPos1 = $.level.pathfinder.startPositions[0]
    const startPos2 = $.level.pathfinder.startPositions[1]

    const { getFairyClassFromQueryParams } = useFairies()
    const [playerFairyClass, enemyFairyClass] = getFairyClassFromQueryParams()

    ArenaPlayerController({
      fairy: { ...(playerFairyClass as Fairy) },
      stats: { name: (playerFairyClass as Fairy).name, hp: 100, previousHp: 100, mp: 50, previousMp: 50 },
      startPosition: new Vector3(startPos1.x, startPos1.y, startPos1.z),
      startRotation: startPos1.quaternion,
      modelHeight: 1.8,
      guild: 'guild-0' as Guild,
    })

    AIController({
      ...(enemyFairyClass as Fairy),
      stats: { name: (enemyFairyClass as Fairy).name },
      startPosition: new Vector3(startPos2.x, startPos2.y, startPos2.z),
      startRotation: startPos2.quaternion,
      modelHeight: 1.8,
      guild: 'guild-1' as Guild,
    })

    Crosshair()

    $.addEvent('battle.cleanup', () => {
      cleanupLevel(true, true)
      $.showCursor = true
      $.controls.removePointerLock()
    })

    const arenaEndEventUuid = $.addEvent('renderer.update', () => {
      if ($.isBattleOver) {
        $.removeEvent('renderer.update', arenaEndEventUuid)
        $.triggerEvent('battle.cleanup')
      }
    })

    $.isWorldInitialized = true
    $.loadingManager.itemEnd('loading-screen')
  })
}
export default Arena
