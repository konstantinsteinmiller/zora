import MountainArena from '@/entity/MountainArena.ts'
import type { Box3, Object3D } from 'three'
import * as THREE from 'three'
import state from '@/states/GlobalState'

let testWorld: any = null
export default () => {
  if (testWorld !== null) {
    return testWorld
  }

  let objects: Object3D[] = []
  testWorld = new THREE.Object3D()

  const loadMaterial = (name: string, tiling: number) => {
    const mapLoader = new THREE.TextureLoader()
    const maxAnisotropy = state.renderer.capabilities.getMaxAnisotropy()

    const metalMap = mapLoader.load(`world/${name}metallic.png`)
    metalMap.anisotropy = maxAnisotropy
    metalMap.wrapS = THREE.RepeatWrapping
    metalMap.wrapT = THREE.RepeatWrapping
    metalMap.repeat.set(tiling, tiling)

    const albedo = mapLoader.load(`world/${name}albedo.png`)
    albedo.anisotropy = maxAnisotropy
    albedo.wrapS = THREE.RepeatWrapping
    albedo.wrapT = THREE.RepeatWrapping
    albedo.repeat.set(tiling, tiling)
    albedo.encoding = THREE.sRGBEncoding

    const normalMap = mapLoader.load(`world/${name}normal.png`)
    normalMap.anisotropy = maxAnisotropy
    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.set(tiling, tiling)

    const roughnessMap = mapLoader.load(`world/${name}roughness.png`)
    roughnessMap.anisotropy = maxAnisotropy
    roughnessMap.wrapS = THREE.RepeatWrapping
    roughnessMap.wrapT = THREE.RepeatWrapping
    roughnessMap.repeat.set(tiling, tiling)

    const material = new THREE.MeshStandardMaterial({
      metalnessMap: metalMap,
      map: albedo,
      normalMap: normalMap,
      roughnessMap: roughnessMap,
    })

    return material
  }

  const createSkybox = () => {
    const loader = new THREE.CubeTextureLoader()
    const environmentMap = loader.load(['/images/skybox/px.png', '/images/skybox/nx.png', '/images/skybox/py.png', '/images/skybox/ny.png', '/images/skybox/pz.png', '/images/skybox/nz.png'])
    environmentMap.encoding = THREE.sRGBEncoding
    state.scene.background = environmentMap
    state.scene.environment = environmentMap
  }

  const createWorldMesh = () => {
    /* initial World plane */
    const mapLoader = new THREE.TextureLoader()
    const maxAnisotropy = state.renderer.capabilities.getMaxAnisotropy()
    const checkerboard = mapLoader.load('world/checkerboard.png')
    checkerboard.anisotropy = maxAnisotropy
    checkerboard.wrapS = THREE.RepeatWrapping
    checkerboard.wrapT = THREE.RepeatWrapping
    checkerboard.repeat.set(32, 32)
    checkerboard.encoding = THREE.sRGBEncoding

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 10, 10), new THREE.MeshStandardMaterial({ map: checkerboard }))
    plane.castShadow = false
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    state.scene.add(plane)

    const box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), loadMaterial('vintage-tile1_', 0.2))
    box.position.set(10, 2, 0)
    box.castShadow = true
    box.receiveShadow = true
    state.scene.add(box)

    const concreteMaterial = loadMaterial('concrete3-', 4)

    const wall1 = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 4), concreteMaterial)
    wall1.position.set(0, -40, -50)
    wall1.name = 'wall1'
    wall1.castShadow = true
    wall1.receiveShadow = true
    state.scene.add(wall1)

    const wall2 = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 4), concreteMaterial)
    wall2.position.set(0, -40, 50)
    wall2.name = 'wall2'
    wall2.castShadow = true
    wall2.receiveShadow = true
    state.scene.add(wall2)

    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(4, 100, 100), concreteMaterial)
    wall3.position.set(50, -40, 0)
    wall3.name = 'wall3'
    wall3.castShadow = true
    wall3.receiveShadow = true
    state.scene.add(wall3)

    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(4, 100, 100), concreteMaterial)
    wall4.position.set(-50, -40, 0)
    wall4.name = 'wall4'
    wall4.castShadow = true
    wall4.receiveShadow = true
    state.scene.add(wall4)

    // Create Box3 for each mesh in the scene so that we can
    // do some easy intersection tests.
    const meshes = [plane, box, wall1, wall2, wall3, wall4]

    objects = []

    for (let i = 0; i < meshes.length; ++i) {
      const box: Box3 = new THREE.Box3()
      box.setFromObject(meshes[i])
      objects.push(box)
    }
  }

  createSkybox()
  // createWorldMesh()
  const mountainArena = MountainArena()

  testWorld.add(mountainArena)

  testWorld.objects = objects
  state.scene.add(testWorld)

  return testWorld
}