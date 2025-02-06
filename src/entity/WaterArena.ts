import AssetLoader from '@/engine/AssetLoader.ts'
import Ground from '@/entity/water/Ground.ts'
import Water from '@/entity/water/Water.ts'
import { setupUI } from '@/utils/tweakpane-ui.ts'
import { Object3D, TextureLoader } from 'three'
import state from '@/states/GlobalState'

export default async () => {
  if (state.waterArena) {
    return state.waterArena
  }

  state.waterArena = new Object3D()
  const { loadMesh } = AssetLoader()
  loadMesh(
    '/worlds/arenas/water-arena.fbx',
    state.waterArena,
    50 /*, (scene: Object3D) => {
    console.log('callback: ')
  }*/
  )

  state.waterArena.position.set(25, 6, 0)
  const waterResolution = { size: 256 }
  const water = Water({
    options: {
      amplitude: 0.05,
      frequency: 8.9,
      persistence: 0.89,
      lacunarity: 1.66,
      speed: 0.25,
    },
    resolution: waterResolution.size,
    environmentMap: state.scene.environment,
  })
  // const sandTexture: any = new TextureLoader().load('/images/sand/ocean_floor.png')
  // const ground = Ground({ texture: sandTexture })
  // setupUI({ waterResolution, water, ground })
  state.player.position.set(0, 0.5, 0)
  const createColliders = () => {}

  state.waterArena.name = 'WaterArenaContainer'
  // mesh.objects = objects
  state.scene.add(state.waterArena)

  return state.waterArena
}
