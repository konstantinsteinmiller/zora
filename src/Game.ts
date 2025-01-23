import * as THREE from 'three'
import Rapier from '@dimforge/rapier3d-compat'
import World from '@/entity/World'
import CharacterController from '@/entity/CharacterController.ts'
import Camera from '@/engine/Camera'
import Light from '@/engine/Light.js'
import Renderer from '@/engine/Renderer'

export default class Game {
  constructor(/*props*/) {
    // super(props)
    this.init()
  }

  async init() {
    await Rapier.init()
    window.physic = new Rapier.World({ x: 0, y: -9.81, z: 0 })

    window.scene = new THREE.Scene()
    window.camera = new Camera()

    window.world = new World()
    // console.log('meshesWorld: ', meshesWorld.players)
    const player = new CharacterController()
    const light = new Light()

    scene.add(world)
    scene.add(light)
    scene.add(player)

    window.renderer = new Renderer()

    renderer.onUpdate((dt: number) => {
      physic.step()
      player.update(dt)
      camera.update(player)
      light.update(player)
    })
  }
}
