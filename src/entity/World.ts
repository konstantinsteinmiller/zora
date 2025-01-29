import * as THREE from 'three'

export default class World extends THREE.Object3D {
  constructor() {
    super()

    this.createSkybox()
    this.createWorldMesh()

    this.init()
  }

  init() {}

  createSkybox() {
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load(['/images/skybox/px.png', '/images/skybox/nx.png', '/images/skybox/py.png', '/images/skybox/ny.png', '/images/skybox/pz.png', '/images/skybox/nz.png'])
    texture.encoding = THREE.sRGBEncoding
    scene.background = texture
  }

  createWorldMesh() {
    /* initial World plane */
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 20, 10), new THREE.MeshStandardMaterial({ color: 0x808080 }))
    plane.castShadow = false
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)
  }
}
