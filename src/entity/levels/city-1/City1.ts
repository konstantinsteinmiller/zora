import $ from '@/global'
import { assetManager, createGeoIndex, loadNavMesh } from '@/engine/AssetLoader'
import FairyDust from '@/entity/FairyDust.ts'
import * as THREE from 'three'
import { Mesh, MeshBasicMaterial, Object3D } from 'three'
import { createCollidersForGraph } from '@/utils/physics'
import { Pathfinding, PathfindingHelper } from 'three-pathfinding'
import { startPositions } from '@/entity/levels/city-1/config'

export default async (onFinishedCallback: () => void) => {
  const level: any = new Object3D()
  level.WPsMap = assetManager.assets.WPsMap

  const promise = await new Promise(resolve => {
    const glb: any = { scene: assetManager.getModel('/worlds/city-1/city-1.comp.glb')?.clone() }
    const houses: any = { scene: assetManager.getModel('/worlds/city-1/city-1-houses.comp.glb')?.clone() }
    // console.log('houses.scene.children[0]: ', houses.scene.children[0])
    glb.scene.children[0].children.concat(houses.scene.children[0].children).forEach((child: any) => {
      if (child instanceof Mesh) {
        if (child?.material?.map) {
          child.material.map.encoding = (THREE as any).sRGBEncoding
        }

        child.castShadow = true
        child.receiveShadow = true
        child = createGeoIndex(child)
        level.add(child)
      }
    })

    // console.log('Compressed GLB loaded!')
    resolve(glb.scene)
  })

  const pathfinder: any = new Pathfinding()
  pathfinder.startPositions = startPositions
  pathfinder.orientationPosition = { x: 0, y: 0, z: 0 }
  pathfinder.pathfindingHelper = new PathfindingHelper()

  loadNavMesh('/worlds/city-1/city-1-navmesh.fbx', (navMesh: any) => {
    const geo = navMesh.clone().geometry.clone()
    geo.rotateX(-Math.PI / 2)

    // $.scene.add(navMesh)
    level.zone = 'city-1'
    pathfinder.setZoneData(level.zone, Pathfinding.createZone(geo))
    level.children.forEach((child: any) => {
      child.entityType = 'level'
    })

    if ($.isDebug) {
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

  createCollidersForGraph(level, 'fixed', undefined, 0)
  level.name = 'City1Container'
  level.pathfinder = pathfinder
  level.movingEntitiesList = []
  level.objects = []

  $.scene.add(level)
  $.level = level

  // FairyDust({ position: new Vector3(9.5, -2.1, 7) })
  // FairyDust({ position: new Vector3(8, 5, 2.4) })

  onFinishedCallback()

  return level
}
