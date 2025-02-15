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

  CharacterController()
  EnemyController({
    modelPath: '/models/fairy/nature_fairy_1.fbx',
    stats: undefined,
    startPosition: new Vector3(8.5, 0, 2),
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
