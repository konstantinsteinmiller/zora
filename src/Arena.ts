import EnemyController from '@/entity/EnemyController.ts'
import { cleanupLevel } from '@/Game.ts'
import state from '@/states/GlobalState'
import { Vector3 } from 'three'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Crosshair from '@/entity/Crosshair'

const Arena = async (level = 'water-arena') => {
  World(() => {
    const startPos1 = state.level.pathfinder.startPositions[0]
    const startPos2 = state.level.pathfinder.startPositions[1]

    CharacterController({
      modelPath: 'models/thunder-fairy/thunder_fairy_1.fbx',
      stats: {
        name: 'player',
        hp: 100,
        previousHp: 100,
        mp: 77,
        previousMp: 77,
      },
      startPosition: new Vector3(startPos1.x, startPos1.y, startPos1.z),
      startRotation: startPos1.quaternion,
      modelHeight: 1.8,
    })

    const enemy = EnemyController({
      enemy: state.player,
      modelPath: 'models/fairy/nature_fairy_1.fbx',
      name: 'enemy',
      startPosition: new Vector3(startPos2.x, startPos2.y, startPos2.z),
      startRotation: startPos2.quaternion,
      modelHeight: 1.8,
    })
    const enemyUpdateEventUuid = state.addEvent('renderer.update', () => {
      if (!state.loadingManager.isLoading) {
        state.removeEvent('renderer.update', enemyUpdateEventUuid)
        enemy.start()
      }
    })

    Crosshair()

    state.addEvent('battle.cleanup', () => {
      cleanupLevel(true)
    })

    const arenaEndEventUuid = state.addEvent('renderer.update', () => {
      if (state.isBattleOver) {
        state.removeEvent('renderer.update', arenaEndEventUuid)
        state.triggerEvent('battle.cleanup')
        setTimeout(() => {
          state.clearAllEvents()
        }, 1000)
      }
    })

    state.isBattleInitialized = true
  })
}
export default Arena
