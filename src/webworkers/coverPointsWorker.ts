import { Vector3, Raycaster, BufferGeometry, Mesh, MeshBasicMaterial, Scene, Uint32BufferAttribute, Float32BufferAttribute, BoxGeometry, MeshStandardMaterial } from 'three'

const scene = new Scene()
const rayCaster = new Raycaster()
let worldMesh: Mesh | null = null

self.onmessage = function (event: MessageEvent) {
  const { coverPositions, enemyPosition, enemyHalfHeight, entityPosition, entityHalfHeight, world: world } = event.data

  // Convert world geometry to a Three.js Mesh if not already done
  if (!worldMesh) {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(world.vertices, 3))
    geometry.setIndex(new Uint32BufferAttribute(world.indices, 1))

    const material = new MeshBasicMaterial({ visible: false }) // Invisible for performance
    worldMesh = new Mesh(geometry, material)
    worldMesh.name = 'world'
    worldMesh.updateMatrixWorld(true)
    scene.add(worldMesh)
  }

  const enemyPos = new Vector3(enemyPosition.x, enemyPosition.y + enemyHalfHeight, enemyPosition.z)
  const entityPos = new Vector3(entityPosition.x, entityPosition.y + entityHalfHeight, entityPosition.z)

  // Add a green box at the cover position
  const coverBoxGeometry = new BoxGeometry(0.6, 0.6, 0.6)
  const coverBoxMaterial = new MeshStandardMaterial({ color: 0xf0df00 })

  coverPositions.forEach((cover: any) => {
    const coverPos = new Vector3(cover.x, cover.y + entityHalfHeight, cover.z)

    // const coverPos = new Vector3(cover.x, cover.y + 0.9, cover.z)
    const coverBox = new Mesh(coverBoxGeometry, coverBoxMaterial)
    coverBox.position.copy(coverPos)
    coverBox.name = 'cover'
    worldMesh?.add(coverBox)
    scene.updateMatrixWorld(true)
  })

  const coverPositionsWithCoverPointsList = coverPositions
    .map((cover: any) => {
      const coverPos = new Vector3(cover.x, cover.y, cover.z)
      const distance = entityPos.distanceTo(coverPos)

      return { ...cover, distance }
    })
    .sort((a: any, b: any) => a.distance - b.distance)

  /* start ray casting from the closest, if one is blocked -> a cover position is found */
  const bestCover: any | null = coverPositionsWithCoverPointsList.find((cover: any) => {
    const coverPos = new Vector3(cover.x, cover.y + 0.9, cover.z)

    const directionN = new Vector3().subVectors(coverPos, enemyPos).normalize()
    rayCaster.set(enemyPos, directionN)
    const intersects = rayCaster.intersectObjects([scene], true)

    if (intersects.length > 0) {
      const foundCover = intersects.find(intersect => intersect.object?.name === 'cover')
      if (intersects?.[0].object?.name !== 'cover' && foundCover) {
        return cover
      }
    }
  })

  // Send the result back to the main thread
  self.postMessage({ bestCover: bestCover ? { x: bestCover.x, y: bestCover.y, z: bestCover.z } : null })

  // Clean up worldMesh after use
  if (worldMesh) {
    worldMesh.children.forEach(coverBox => {
      worldMesh?.remove(coverBox)
      coverBox.geometry.dispose()
      coverBox.material.dispose()
    })

    scene.remove(worldMesh)
    worldMesh.geometry.dispose()
    ;(worldMesh.material as MeshBasicMaterial).dispose()
    worldMesh = null
  }
}
