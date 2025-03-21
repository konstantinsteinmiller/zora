import WaterArena from '@/entity/levels/water-arena/WaterArena.ts'
import { CubeTextureLoader } from 'three'
import state from '@/states/GlobalState'
import * as THREE from 'three'

export default (onFinishedCallback: () => void) => {
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
    environmentMap.encoding = (THREE as any).sRGBEncoding
    state.scene.background = environmentMap
    state.scene.environment = environmentMap
  }

  createSkybox()
  // MountainArena()
  WaterArena(onFinishedCallback)
}
