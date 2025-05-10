import AIController from '@/entity/AIController.ts'
import ArenaPlayerController from '@/entity/ArenaPlayerController.ts'
import { cleanupLevel } from '@/Game.ts'
import $ from '@/global'
import { ENERGY_FEMALE_OLD } from '@/Story/Fairies/energy-fairies.ts'
import { ICE_SNOWMAN_MIDDLE, ICE_SNOWMAN_OLD, ICE_SNOWMAN_YOUNG } from '@/Story/Fairies/ice-fairies.ts'
import { METAL_SCORPION_MIDDLE, METAL_SCORPION_OLD, METAL_SCORPION_YOUNG } from '@/Story/Fairies/metal-fairies.ts'
import { WATER_MERMAID_MIDDLE, WATER_MERMAID_OLD, WATER_MERMAID_YOUNG } from '@/Story/Fairies/water-fairies.ts'
import type { Guild } from '@/types/entity.ts'
import stats from '@/utils/stats.ts'
import { Vector3 } from 'three'
import World from '@/entity/World'
import Crosshair from '@/entity/Crosshair'

const Arena = async level => {
  World('water-arena', () => {
    const startPos1 = $.level.pathfinder.startPositions[0]
    const startPos2 = $.level.pathfinder.startPositions[1]

    ArenaPlayerController({
      ...WATER_MERMAID_OLD,
      stats: {
        name: WATER_MERMAID_OLD.name,
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

    AIController({
      modelPath: '/models/nature-butterfly-middle/nature-butterfly-middle.fbx',
      stats: { name: 'enemy' },
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
