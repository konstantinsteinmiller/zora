import * as THREE from 'three'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Light from '@/engine/Light'
import Renderer from '@/engine/Renderer'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'
import FirstPersonCamera from '@/engine/FirstPersonCamera.ts'
import state from '@/states/GlobalState'
import Physics from '@/engine/Physics'
import AxesHelper from '@/engine/AxesHelper'
import WaterTutorial from '@/entity/water/WaterTutorial'
import Camera from '@/engine/Camera'
import Crosshair from '@/entity/Crosshair'

export default class Game {
   constructor() {
    this.init()
  }

  async init() {
    await Physics()
    state.scene = new THREE.Scene()
    state.uiScene = new THREE.Scene()

    CharacterController()
    Camera()

    Light()
    Renderer()
    World()
    AxesHelper()
    Crosshair()

    // WaterTutorial()
  }
}
