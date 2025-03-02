import WaterArena from '@/entity/levels/water-arena/WaterArena.ts'
import { CubeTextureLoader, Object3D } from 'three'
import state from '@/states/GlobalState'
import * as THREE from 'three'

let world: any = null
export default (onFinishedCallback: () => void) => {
  if (world !== null) {
    return world
  }

  world = new Object3D()

  const createSkybox = () => {
    const loader = new CubeTextureLoader(state.loadingManager)
    const src = 'skybox'
    state.loadingManager.itemStart(src)
    const environmentMap = loader.load(
      [
        'images/skybox/px.png',
        'images/skybox/nx.png',
        'images/skybox/py.png',
        'images/skybox/ny.png',
        'images/skybox/pz.png',
        'images/skybox/nz.png',
      ],
      () => state.loadingManager.itemEnd(src),
      (fileProgressEvent: any) => state.fileLoader.onFileProgress(src, fileProgressEvent),
      () => state.loadingManager.itemError(src)
    )
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
