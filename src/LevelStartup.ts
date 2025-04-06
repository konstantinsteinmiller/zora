import PlayerController from '@/entity/PlayerController.ts'
import { cleanupLevel } from '@/Game.ts'
import $ from '@/global'
import type { Guild } from '@/types/entity.ts'
import useOctree from '@/use/useOctree.ts'
import { Vector3 } from 'three'
import World from '@/entity/World'
import City1Startup from '@/entity/levels/city-1/city-1-startup.ts'
import { Octree } from 'three/examples/jsm/math/Octree'

const LevelStartup = async (level: string) => {
  World(level, async () => {
    switch (level) {
      case 'city-1':
        City1Startup()
        break
      case 'city-2':
        break
      default:
        console.error('Unknown level:', level)
        return
    }

    const startPos1 = $.level.pathfinder.startPositions[0]

    PlayerController({
      modelPath: '/models/fairy-trainer/fairy-trainer.fbx',
      stats: { name: 'trainer' },
      startPosition: new Vector3(startPos1.x, startPos1.y, startPos1.z),
      startRotation: startPos1.quaternion,
      modelHeight: 1.8,
      guild: 'guild-0' as Guild,
    })

    $.addEvent('level.cleanup', () => {
      cleanupLevel(true, true)
      $.showCursor = true
      $.controls.removePointerLock()

      const { clearOctree } = useOctree()
      clearOctree()
    })

    // const levelEndEventUuid = $.addEvent('renderer.update', () => {
    //   if ($.isBattleStarting) {
    //     $.removeEvent('renderer.update', levelEndEventUuid)
    //     console.log('isBattleStarting: ', $.isBattleStarting)
    //     // $.triggerEvent('level.cleanup')
    //   }
    // })

    $.isWorldInitialized = true
    $.loadingManager.itemEnd('loading-screen')
  })
}
export default LevelStartup
