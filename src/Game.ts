import * as THREE from 'three'
import Rapier from '@dimforge/rapier3d-compat'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Light from '@/engine/Light.js'
import Renderer from '@/engine/Renderer'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'
import FirstPersonCamera from '@/engine/FirstPersonCamera.ts'

export default class Game {
  isThirdPerson = false
  aspect = window.innerWidth / window.innerHeight
  private thirdPersonCamera: any

  constructor(/*props*/) {
    // super(props)
    this.init()
  }

  async init() {
    await Rapier.init()
    window.showCrosshair = true
    window.physic = new Rapier.World({ x: 0, y: -9.81, z: 0 })

    window.scene = new THREE.Scene()
    window.uiScene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000)
    this.camera.position.set(0, 2, 0)
    window.camera = this.camera
    // window.camera = new OrthographicCamera()
    window.uiCamera = new THREE.OrthographicCamera(-1, 1, this.aspect, -1 * this.aspect, 1, 1000)
    // console.log('meshesWorld:', meshesWorld.players)
    const player = new CharacterController()

    if (this.isThirdPerson) {
      this.thirdPersonCamera = new ThirdPersonCamera({
        target: player,
      })
    } else {
      this.fpsCamera = new FirstPersonCamera(player.inputController)
    }

    const light = new Light()

    scene.add(light)
    // scene.add(player)

    window.renderer = new Renderer()

    window.world = new World()

    renderer.onUpdate((elapsedTimeInS: number) => {
      physic.step()
      player.update(elapsedTimeInS)
      // camera.update(player)
      light.update(player)
    })
    renderer.postUpdate((elapsedTimeInS: number) => {
      if (this.isThirdPerson) {
        this.thirdPersonCamera.update(elapsedTimeInS)
      } else {
        this.fpsCamera.update(elapsedTimeInS)
      }
    })
  }
}
