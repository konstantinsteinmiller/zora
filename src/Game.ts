import * as THREE from 'three'
import Rapier from '@dimforge/rapier3d-compat'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import OrthographicCamera from '@/engine/OrthographicCamera.ts'
import Light from '@/engine/Light.js'
import Renderer from '@/engine/Renderer'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'

export default class Game {
  constructor(/*props*/) {
    // super(props)
    this.init()
  }

  async init() {
    await Rapier.init()
    window.physic = new Rapier.World({ x: 0, y: -9.81, z: 0 })

    window.scene = new THREE.Scene()
    // window.camera = new OrthographicCamera()
    this.camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000)
    // this.camera.position.set(25, 10, 25)
    window.camera = this.camera

    window.world = new World()
    // console.log('meshesWorld:', meshesWorld.players)
    const player = new CharacterController()
    const thirdPersonCamera = new ThirdPersonCamera({
      target: player,
    })
    const light = new Light()

    scene.add(world)
    scene.add(light)
    scene.add(player)

    window.renderer = new Renderer()

    renderer.onUpdate((dt: number) => {
      physic.step()
      player.update(dt)
      // camera.update(player)
      light.update(player)
    })
    renderer.postUpdate((dt: number) => {
      thirdPersonCamera.update(dt)
    })
  }
}
