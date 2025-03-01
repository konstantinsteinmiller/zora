import WaterArena from '@/entity/levels/water-arena/WaterArena.ts'
import * as THREE from 'three'
import state from '@/states/GlobalState'

let world: any = null
export default (onFinishedCallback: () => void) => {
  if (world !== null) {
    return world
  }

  world = new THREE.Object3D()

  const createSkybox = () => {
    const loader = new THREE.CubeTextureLoader()
    const environmentMap = loader.load([
      'images/skybox/px.png',
      'images/skybox/nx.png',
      'images/skybox/py.png',
      'images/skybox/ny.png',
      'images/skybox/pz.png',
      'images/skybox/nz.png',
    ])
    environmentMap.encoding = THREE.sRGBEncoding
    state.scene.background = environmentMap
    state.scene.environment = environmentMap
  }

  createSkybox()
  // MountainArena()
  WaterArena(onFinishedCallback)

  // world.add(state.mountainArena)
  // world.add(state.waterArena)

  state.scene.add(world)

  return world
}
