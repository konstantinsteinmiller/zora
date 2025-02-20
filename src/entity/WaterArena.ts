import AssetLoader from '@/engine/AssetLoader.ts'
import Water from '@/entity/water/Water.ts'
import { loadNavMesh } from '@/utils/navigation.ts'
import { Color, Mesh, MeshBasicMaterial, Object3D, TextureLoader, Vector3 } from 'three'
import state from '@/states/GlobalState'
import { createCollidersForGraph } from '@/utils/physics.ts'
import { Pathfinding, PathfindingHelper } from 'three-pathfinding'

export default async () => {
  if (state.waterArena) {
    return state.waterArena
  }

  state.waterArena = new Object3D()
  const { loadMesh } = AssetLoader()
  await loadMesh('worlds/arenas/water-arena.fbx', state.waterArena, 1)

  // state.waterArena.position.set(2.98, -0.06, -0.02)
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

  const pathfinder: any = new Pathfinding()
  pathfinder.pathfindingHelper = new PathfindingHelper()
  loadNavMesh('worlds/arenas/water-arena-navmesh.fbx', (navMesh: any) => {
    const geo = navMesh.clone().geometry.clone()
    geo.rotateX(-Math.PI / 2)

    // state.scene.add(navMesh)
    state.waterArena.zone = 'water-arena'
    pathfinder.setZoneData(state.waterArena.zone, Pathfinding.createZone(geo))
    state.waterArena.pathfinder = pathfinder

    const wiredNavMesh = new Mesh(geo, new MeshBasicMaterial({ color: 0x202020, wireframe: true }))
    state.scene.add(wiredNavMesh)
    const wiredFillMesh = new Mesh(
      geo,
      new MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
      })
    )
    state.scene.add(wiredFillMesh)
    state.scene.add(pathfinder.pathfindingHelper)
  })

  createCollidersForGraph(state.waterArena, 'fixed')
  state.waterArena.name = 'WaterArenaContainer'
  state.waterArena.movingEntitiesList = []
  state.scene.add(state.waterArena)
  state.level = state.waterArena

  return state.waterArena
}
