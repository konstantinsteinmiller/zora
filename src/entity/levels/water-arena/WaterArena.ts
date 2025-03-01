import state from '@/states/GlobalState.ts'
import {
  portalConnectionsList,
  orientationPosition,
  portalTransitionMap,
  coverPositions,
  startPositions,
} from '@/entity/levels/water-arena/config.ts'
import AssetLoader from '@/engine/AssetLoader.ts'
import Water from '@/entity/water/Water.ts'
import { loadNavMesh } from '@/utils/navigation.ts'
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D } from 'three'
import { createCollidersForGraph } from '@/utils/physics.ts'
import { Pathfinding, PathfindingHelper } from 'three-pathfinding'

export default async (onFinishedCallback: () => void) => {
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
  pathfinder.portalConnectionsList = portalConnectionsList
  pathfinder.portalTransitionMap = portalTransitionMap
  pathfinder.orientationPosition = orientationPosition
  pathfinder.coverPositions = coverPositions
  pathfinder.startPositions = startPositions
  pathfinder.pathfindingHelper = new PathfindingHelper()

  loadNavMesh('worlds/arenas/water-arena-navmesh.fbx', (navMesh: any) => {
    const geo = navMesh.clone().geometry.clone()
    geo.rotateX(-Math.PI / 2)

    // state.scene.add(navMesh)
    state.waterArena.zone = 'water-arena'
    pathfinder.setZoneData(state.waterArena.zone, Pathfinding.createZone(geo))
    state.waterArena.children.forEach((child: any) => {
      child.entityType = 'level'
    })

    if (state.enableDebug) {
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
    }
    state.scene.add(pathfinder.pathfindingHelper)
  })

  const coverBoxGeometry = new BoxGeometry(0.5, 0.5, 0.5)
  coverBoxGeometry.computeBoundingBox()
  coverBoxGeometry.computeBoundingSphere()

  /*
  Debugging Cover Positions
  coverPositions.forEach((cover: any) => {
    const coverPos = new Vector3(cover.x, cover.y + 0.9, cover.z)

    const coverBoxMaterial = new MeshStandardMaterial({ color: 0xf0df00 })
    const coverBox = new Mesh(coverBoxGeometry, coverBoxMaterial)
    coverBox.position.copy(coverPos)
    coverBox.name = 'cover'
    state.waterArena.add(coverBox)
    state.scene.updateMatrixWorld(true)
  })*/

  createCollidersForGraph(state.waterArena, 'fixed')
  state.waterArena.name = 'WaterArenaContainer'
  state.waterArena.pathfinder = pathfinder
  state.waterArena.movingEntitiesList = []
  state.scene.add(state.waterArena)
  state.level = state.waterArena
  onFinishedCallback()

  return state.waterArena
}
