import * as THREE from 'three'
import Rapier from '@dimforge/rapier3d-compat'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Light from '@/engine/Light.js'
import Renderer from '@/engine/Renderer'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'
import FirstPersonCamera from '@/engine/FirstPersonCamera.ts'
import { setupUI } from '@/utils/tweakpane-ui.ts'
import Water from '@/entity/water/Water.ts'
import Ground from '@/entity/water/Ground.ts'

export default class Game {
  aspect = window.innerWidth / window.innerHeight
  private thirdPersonCamera: any

  constructor() {
    this.init()
  }

  async init() {
    await Rapier.init()
    window.showCursor = false
    window.showCrosshair = true
    window.isThirdPerson = true
    window.physic = new Rapier.World({ x: 0, y: -9.81, z: 0 })

    window.scene = new THREE.Scene()
    window.uiScene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.5, 1000)
    this.camera.position.set(0, 2, 0)
    window.camera = this.camera
    // window.camera = new OrthographicCamera()
    window.uiCamera = new THREE.OrthographicCamera(-1, 1, this.aspect, -1 * this.aspect, 1, 1000)
    // console.log('meshesWorld:', meshesWorld.players)
    const player = new CharacterController()
    window.player = player

    this.thirdPersonCamera = new ThirdPersonCamera({
      player: player,
    })
    this.fpsCamera = new FirstPersonCamera(player)

    const light = new Light()

    window.renderer = new Renderer()
    window.world = new World()
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    /* Water tutorial */
    const waterResolution = { size: 256 }
    const water = Water({ resolution: waterResolution.size, environmentMap: scene.environment })
    const sandTexture: any = new THREE.TextureLoader().load('/images/sand/ocean_floor.png')
    const ground = Ground({ texture: sandTexture })
    setupUI({ waterResolution, water, ground })

    renderer.onUpdate((elapsedTimeInS: number, elapsedTime: number) => {
      physic.step()
      player.update(elapsedTimeInS)
      axesHelper.position.copy(player.getPosition)
      axesHelper.position.y = axesHelper.position.y + 0.5
      axesHelper.quaternion.copy(player.getRotation)
      // camera.update(player)
      light.update(player)
      water.update(elapsedTime)
      ground.update(elapsedTime)
    })
    renderer.postUpdate((elapsedTimeInS: number) => {
      if (window.isThirdPerson) {
        this.thirdPersonCamera.update(elapsedTimeInS)
      } else {
        this.fpsCamera.update(elapsedTimeInS)
      }
    })
  }
}
