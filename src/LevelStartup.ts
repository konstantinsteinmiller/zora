import PlayerController from '@/entity/PlayerController.ts'
import { cleanupLevel } from '@/Game.ts'
import $ from '@/global'
import type { Guild } from '@/types/entity.ts'
import { Vector3 } from 'three'
import World from '@/entity/World'
import City1Startup from '@/entity/levels/city-1/startup.ts'
import EmberStartup from '@/entity/levels/embersteel/startup.ts'

const LevelStartup = async (level: string) => {
  World(level, async () => {
    switch (level) {
      case 'city-1':
        City1Startup()
        break
      case 'city-2':
        break
      case 'embersteel':
        EmberStartup()
        break
      default:
        console.error('Unknown level:', level)
        return
    }

    let previousPosition = null
    if ($.world?.playerRef?.value?.position) {
      previousPosition = $.world?.playerRef?.value?.position
    }

    const startPosPlayer = previousPosition || $.level.pathfinder.startPositions[0]
    PlayerController({
      modelPath: '/models/fairy-trainer/fairy-trainer.fbx',
      stats: { name: 'trainer' },
      startPosition: new Vector3(startPosPlayer.x, startPosPlayer.y, startPosPlayer.z),
      startRotation: startPosPlayer.quaternion,
      modelHeight: 1.8,
      guild: 'guild-0' as Guild,
      id: 'player',
    })

    $.addEvent('level.cleanup', () => {
      cleanupLevel(true, true)
      $.showCursor = true
      $?.controls?.removePointerLock?.()
    })

    // const levelEndEventUuid = $.addEvent('renderer.update', () => {
    //   if ($.isBattleStarting.value) {
    //     $.removeEvent('renderer.update', levelEndEventUuid)
    //     console.log('isBattleStarting: ', $.isBattleStarting.value)
    //     // $.triggerEvent('level.cleanup')
    //   }
    // })

    $.isWorldInitialized = true
    $.loadingManager.itemEnd('loading-screen')
  })
}
export default LevelStartup
