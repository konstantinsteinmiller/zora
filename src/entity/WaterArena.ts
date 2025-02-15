import AssetLoader from '@/engine/AssetLoader.ts'
import Ground from '@/entity/water/Ground.ts'
import ground from '@/entity/water/Ground.ts'
import Water from '@/entity/water/Water.ts'
import { setupUI } from '@/utils/tweakpane-ui.ts'
import { Object3D, TextureLoader } from 'three'
import state from '@/states/GlobalState'
import { createCollidersForGraph } from '@/utils/physics.ts'

export default async () => {
  if (state.waterArena) {
    return state.waterArena
  }

  state.waterArena = new Object3D()
  const { loadMesh } = AssetLoader()
  await loadMesh('/worlds/arenas/water-arena.fbx', state.waterArena, 1)

  state.waterArena.position.set(2.98, -0.06, -0.02)
  if (state.enableWater) {
    const waterResolution = { size: 256 }
    const water = Water({
      options: {
        amplitude: 0.2,
        frequency: 2.9,
        persistence: 1.89,
        lacunarity: 4.76,
        speed: 0.25,
      },
      resolution: waterResolution.size,
      environmentMap: state.scene.environment,
    })
    water.position.set(0, -2.8, 0)
    // const sandTexture: any = new TextureLoader().load('/images/sand/ocean_floor.png')
    // const ground = Ground({ texture: sandTexture })
    // setupUI({ waterResolution, water, ground })
    // state.player.position.set(2500, 1000, 2000)
  }

  createCollidersForGraph(state.waterArena, 'fixed')
  state.waterArena.name = 'WaterArenaContainer'
  state.scene.add(state.waterArena)

  return state.waterArena
}
