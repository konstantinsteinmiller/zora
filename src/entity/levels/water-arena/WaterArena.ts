import FairyDust from '@/entity/FairyDust.ts'
import FleeOrb from '@/entity/levels/FleeOrb.ts'
import AttackPowerUp from '@/entity/power-ups/AttackPowerUp'
import DefensePowerUp from '@/entity/power-ups/DefensePowerUp'
import $ from '@/global'
import {
  portalConnectionsList,
  orientationPosition,
  portalTransitionMap,
  coverPositions,
  startPositions,
} from '@/entity/levels/water-arena/config'
import AssetLoader, { loadNavMesh } from '@/engine/AssetLoader'
import Water from '@/entity/water/Water'
import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three'
import { createCollidersForGraph } from '@/utils/physics'
import { Pathfinding, PathfindingHelper } from 'three-pathfinding'

export default async (onFinishedCallback: () => void) => {
  const waterArena: any = new Object3D()
  const { loadMesh } = AssetLoader()
  await loadMesh('/worlds/arenas/water-arena.comp.glb', waterArena, 1)

  if ($.enableWater) {
    const waterResolution = { size: 256 }
    const water = Water({
      options: {
        amplitude: 0.2,
        frequency: 2.9,
        persistence: 1.89,
        lacunarity: 4.76,
        speed: 0.25,
        customPlaneProps: [
          {
            key: 'isBattleProtected',
            value: true,
          },
        ],
      },
      resolution: waterResolution.size,
      environmentMap: $.scene.environment,
    })
    water.position.set(0, -2.8, 0)
    // const sandTexture: any = new TextureLoader().load('/images/sand/ocean_floor.png')
    // const ground = Ground({ texture: sandTexture })
    // setupUI({ waterResolution, water, ground })
    // $.player.position.set(2500, 1000, 2000)
  }

  const pathfinder: any = new Pathfinding()
  pathfinder.portalConnectionsList = portalConnectionsList
  pathfinder.portalTransitionMap = portalTransitionMap
  pathfinder.orientationPosition = orientationPosition
  pathfinder.coverPositions = coverPositions
  pathfinder.startPositions = startPositions
  pathfinder.pathfindingHelper = new PathfindingHelper()

  loadNavMesh('/worlds/arenas/water-arena-navmesh.fbx', (navMesh: any) => {
    const geo = navMesh?.clone()?.geometry.clone()
    geo.rotateX(-Math.PI / 2)

    // $.scene.add(navMesh)
    waterArena.zone = 'water-arena'
    pathfinder.setZoneData(waterArena.zone, Pathfinding.createZone(geo))
    waterArena.children.forEach((child: any) => {
      child.entityType = 'level'
      child.isBattleProtected = true
    })
    waterArena.isBattleProtected = true

    if ($.enableDebug) {
      const wiredNavMesh = new Mesh(geo, new MeshBasicMaterial({ color: 0x202020, wireframe: true }))
      $.scene.add(wiredNavMesh)
      const wiredFillMesh = new Mesh(
        geo,
        new MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.5,
          transparent: true,
        })
      )
      $.scene.add(wiredFillMesh)
    }
    $.scene.add(pathfinder.pathfindingHelper)
  })

  /* add flee point */
  const fleePoint = new Vector3(-1.44, 10, -0.45)
  FleeOrb(fleePoint)

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
    waterArena.add(coverBox)
    $.scene.updateMatrixWorld(true)
  })*/

  createCollidersForGraph(waterArena, 'fixed', undefined, Math.PI / 2)
  waterArena.name = 'WaterArenaContainer'
  waterArena.pathfinder = pathfinder
  waterArena.movingEntitiesList = []
  waterArena.objects = []

  const powerUpList: any[] = [DefensePowerUp, AttackPowerUp]
  pathfinder.portalConnectionsList.forEach((connection: any) => {
    const { entryPosition, entryGroup } = connection
    if (entryGroup === 1) return

    const randomInt: number = Math.random() < 0.5 ? 0 : 1
    const position = entryPosition.clone().add(new Vector3(0, 0.5, 0))
    const powerUp = powerUpList[randomInt](position)
    powerUp.addToLevel(waterArena)
  })

  $.scene.add(waterArena)
  $.level = waterArena

  FairyDust({ position: new Vector3(9.5, -2.1, 7) })
  FairyDust({ position: new Vector3(8, 5, 2.4) })

  onFinishedCallback()

  return waterArena
}
