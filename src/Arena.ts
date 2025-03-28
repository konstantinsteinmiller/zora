import AIController from '@/entity/AIController.ts'
import PlayerController from '@/entity/PlayerController.ts'
import { cleanupLevel } from '@/Game.ts'
import $ from '@/global'
import type { Guild } from '@/types/entity.ts'
import { Vector3 } from 'three'
import World from '@/entity/World'
import Crosshair from '@/entity/Crosshair'

const Arena = async (level = 'water-arena') => {
  World(() => {
    const startPos1 = $.level.pathfinder.startPositions[0]
    const startPos2 = $.level.pathfinder.startPositions[1]

    PlayerController({
      modelPath: 'models/thunder-fairy/thunder_fairy_1.fbx',
      stats: {
        name: 'player',
        hp: 100,
        previousHp: 100,
        mp: 50,
        previousMp: 50,
      },
      startPosition: new Vector3(startPos1.x, startPos1.y, startPos1.z),
      startRotation: startPos1.quaternion,
      modelHeight: 1.8,
      guild: 'guild-0' as Guild,
    })

    const enemy = AIController({
      modelPath: 'models/fairy/nature_fairy_1.fbx',
      stats: { name: 'enemy' },
      startPosition: new Vector3(startPos2.x, startPos2.y, startPos2.z),
      startRotation: startPos2.quaternion,
      modelHeight: 1.8,
      guild: 'guild-1' as Guild,
    })
    const enemyUpdateEventUuid = $.addEvent('renderer.update', () => {
      if (!$.loadingManager.isLoading) {
        $.removeEvent('renderer.update', enemyUpdateEventUuid)
        enemy.start()
      }
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

    $.isBattleInitialized = true
  })
}
export default Arena
