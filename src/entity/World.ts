import WaterArena from '@/entity/levels/water-arena/WaterArena.ts'
import { CubeTextureLoader } from 'three'
import $ from '@/global'
import * as THREE from 'three'

export default (onFinishedCallback: () => void) => {
  const createSkybox = () => {
    const loader = new CubeTextureLoader($.loadingManager)
    const src = 'skybox'
    $.loadingManager.itemStart(src)
    const environmentMap = loader.load(
      [
        'images/skybox/px.png',
        'images/skybox/nx.png',
        'images/skybox/py.png',
        'images/skybox/ny.png',
        'images/skybox/pz.png',
        'images/skybox/nz.png',
      ],
      () => $.loadingManager.itemEnd(src),
      (fileProgressEvent: any) => $.fileLoader.onFileProgress(src, fileProgressEvent),
      () => $.loadingManager.itemError(src)
    )
    environmentMap.encoding = (THREE as any).sRGBEncoding
    $.scene.background = environmentMap
    $.scene.environment = environmentMap
  }

  createSkybox()
  // MountainArena()
  WaterArena(onFinishedCallback)
}
