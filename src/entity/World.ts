import { assetManager } from '@/engine/AssetLoader.ts'
import WaterArena from '@/entity/levels/water-arena/WaterArena.ts'
import $ from '@/global'
import * as THREE from 'three'

export default (onFinishedCallback: () => void) => {
  const createSkybox = () => {
    const environmentMap: any = assetManager.getTexture('/images/skybox/px.avif')
    environmentMap.encoding = (THREE as any).sRGBEncoding
    $.scene.background = environmentMap
    $.scene.environment = environmentMap
  }

  createSkybox()
  // MountainArena()
  WaterArena(onFinishedCallback)
}
