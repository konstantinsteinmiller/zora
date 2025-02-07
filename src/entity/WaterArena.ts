import AssetLoader from '@/engine/AssetLoader.ts'
import Water from '@/entity/water/Water.ts'
import { Object3D } from 'three'
import state from '@/states/GlobalState'
import { createCollidersForGraph } from '@/utils/physics.ts'

export default async () => {
  if (state.waterArena) {
    return state.waterArena
  }

  state.waterArena = new Object3D()
  // state.waterArena.position.set(1000, -320, 0)

  const { loadMesh } = AssetLoader()
  await loadMesh('/worlds/arenas/water-arena.fbx', state.waterArena, 1)

  state.waterArena.position.set(2.98, -0.06, -0.02)
  // const waterResolution = { size: 256 }
  /*const water = Water({
    options: {
      amplitude: 0.05,
      frequency: 8.9,
      persistence: 0.89,
      lacunarity: 1.66,
      speed: 0.25,
    },
    resolution: waterResolution.size,
    environmentMap: state.scene.environment,
  })*/
  // const sandTexture: any = new TextureLoader().load('/images/sand/ocean_floor.png')
  // const ground = Ground({ texture: sandTexture })
  // setupUI({ waterResolution, water, ground })
  // state.player.position.set(2500, 1000, 2000)

  createCollidersForGraph(state.waterArena, 'fixed')
  state.waterArena.name = 'WaterArenaContainer'
  // mesh.objects = objects
  state.scene.add(state.waterArena)

  return state.waterArena
}
