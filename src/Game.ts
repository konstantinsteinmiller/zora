import * as THREE from 'three'
import Rapier from '@dimforge/rapier3d-compat'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Light from '@/engine/Light.js'
import Renderer from '@/engine/Renderer'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'
import FirstPersonCamera from '@/engine/FirstPersonCamera.ts'

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

    renderer.onUpdate((elapsedTimeInS: number) => {
      physic.step()
      player.update(elapsedTimeInS)
      // camera.update(player)
      light.update(player)
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
