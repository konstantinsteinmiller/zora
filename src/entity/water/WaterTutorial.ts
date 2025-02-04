import Water from '@/entity/water/Water.ts'
import Ground from '@/entity/water/Ground.ts'
import { setupUI } from '@/utils/tweakpane-ui.ts'
import { TextureLoader } from 'three'
import state from '@/states/GlobalState'

export default () => {
  /* Water tutorial */
  const waterResolution = { size: 256 }
  const water = Water({ resolution: waterResolution.size, environmentMap: state.scene.environment })
  const sandTexture: any = new TextureLoader().load('/images/sand/ocean_floor.png')
  const ground = Ground({ texture: sandTexture })
  setupUI({ waterResolution, water, ground })
}
