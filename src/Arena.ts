import EnemyController from '@/entity/EnemyController.ts'
import state from '@/states/GlobalState'
import { Vector3 } from 'three'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Crosshair from '@/entity/Crosshair'

export default async () => {
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
    EnemyController({
      enemy: state.player,
      modelPath: 'models/fairy/nature_fairy_1.fbx',
      name: 'enemy',
      startPosition: new Vector3(startPos2.x, startPos2.y, startPos2.z),
      startRotation: startPos2.quaternion,
      modelHeight: 1.8,
    })

    Crosshair()
    state.isBattleInitialized = true
  })
}
