import EnemyController from '@/entity/EnemyController.ts'
import state from '@/states/GlobalState'
import { Vector3 } from 'three'
import * as THREE from 'three'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Light from '@/engine/Light'
import Renderer from '@/engine/Renderer'
import Physics from '@/engine/Physics'
import Camera from '@/engine/Camera'
import Crosshair from '@/entity/Crosshair'

export default async () => {
  await Physics()
  state.scene = new THREE.Scene()
  state.uiScene = new THREE.Scene()

  CharacterController({
    modelPath: 'models/thunder-fairy/thunder_fairy_1.fbx',
    stats: {
      name: 'player',
      hp: 56,
      previousHp: 56,
      mp: 77,
      previousMp: 77,
    },
    startPosition: new Vector3(10.5, 0, 5),
    modelHeight: 1.8,
  })
  EnemyController({
    enemy: state.player,
    modelPath: 'models/fairy/nature_fairy_1.fbx',
    name: 'enemy',
    startPosition: new Vector3(10.5, 0, 9),
    modelHeight: 1.8,
  })
  Camera()

  Light()
  Renderer()
  World()
  // AxesHelper()
  Crosshair()

  // WaterTutorial()
}
