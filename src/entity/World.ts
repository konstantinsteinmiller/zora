import { assetManager } from '@/engine/AssetLoader.ts'
import City1 from '@/entity/levels/city-1/City1.ts'
import Embersteel from '@/entity/levels/embersteel/Embersteel.ts'
import WaterArena from '@/entity/levels/water-arena/WaterArena.ts'
import $ from '@/global'
import * as THREE from 'three'

export default (level: string, onFinishedCallback: () => void) => {
  const createSkybox = () => {
    const environmentMap: any = assetManager.getTexture('/images/skybox/px.avif')
    environmentMap.encoding = (THREE as any).sRGBEncoding
    $.scene.background = environmentMap
    $.scene.environment = environmentMap
  }

  createSkybox()
  // MountainArena()
  switch (level) {
    case 'water-arena':
      WaterArena(onFinishedCallback)
      break
    case 'city-1':
      City1(onFinishedCallback)
      break
    case 'embersteel':
      Embersteel(onFinishedCallback)
      break
    default:
      console.log('Unknown level: ', level)
  }
}
