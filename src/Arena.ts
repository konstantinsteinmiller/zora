import AIController from '@/entity/AIController.ts'
import PlayerController from '@/entity/PlayerController.ts'
import { cleanupLevel } from '@/Game.ts'
import state from '@/states/GlobalState'
import type { Guild } from '@/types/entity.ts'
import { Vector3 } from 'three'
import World from '@/entity/World'
import Crosshair from '@/entity/Crosshair'

const Arena = async (level = 'water-arena') => {
  World(() => {
    const startPos1 = state.level.pathfinder.startPositions[0]
    const startPos2 = state.level.pathfinder.startPositions[1]

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
    const enemyUpdateEventUuid = state.addEvent('renderer.update', () => {
      if (!state.loadingManager.isLoading) {
        state.removeEvent('renderer.update', enemyUpdateEventUuid)
        enemy.start()
      }
    })

    Crosshair()

    state.addEvent('battle.cleanup', () => {
      cleanupLevel(true, true)
      state.showCursor = true
      state.controls.removePointerLock()
    })

    const arenaEndEventUuid = state.addEvent('renderer.update', () => {
      if (state.isBattleOver) {
        state.removeEvent('renderer.update', arenaEndEventUuid)
        state.triggerEvent('battle.cleanup')
      }
    })

    state.isBattleInitialized = true
  })
}
export default Arena
