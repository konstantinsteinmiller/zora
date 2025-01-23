import * as THREE from 'three'

export default class Renderer extends THREE.WebGLRenderer {
  scene = null
  clock = new THREE.Clock()
  camera = null
  cbUpdate: any = null
  cbLoop = null
  previousRAF = null

  constructor() {
    const canvas = document.querySelector('canvas')
    super({
      canvas,
      antialias: true,
      // outputEncoding: THREE.sRGBEncoding,
      // toneMapping: THREE.CineonToneMapping,
      // toneMappingExposure: 1.75,
      // shadowMap: THREE.PCFSoftShadowMap,
      // size: { width: canvas.clientWidth, height: canvas.clientHeight }
    })
    this.setPixelRatio(4)
    this.cbLoop = this.loop.bind(this)
    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap

    this.outputEncoding = THREE.sRGBEncoding
    this.toneMapping = THREE.CineonToneMapping
    this.toneMappingExposure = 1.75

    this.previousRAF = null

    this.createSkybox()
    this.createWolrdMesh()

    window.addEventListener('resize', this.onWindowResize, false)
    this.loop()
  }

  loop() {
    const dt = this.clock.getDelta()
    if (this.previousRAF === null) {
      this.previousRAF = dt
    }

    if (this.cbUpdate) {
      this.cbUpdate(dt)
    }

    this.render(scene, camera)
    requestAnimationFrame(this.cbLoop)
    this.step(dt - this.previousRAF)
    this.previousRAF = dt
  }
  step(timeElapsedInMs: number) {
    const timeElapsedInSeconds = timeElapsedInMs * 0.001
    if (this.controls) {
      this.controls.Update(timeElapsedInSeconds)
    }
  }

  onUpdate(callback: any) {
    this.cbUpdate = callback
  }

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    this.setSize(window.innerWidth, window.innerHeight)
  }

  createSkybox() {
    const loader = new THREE.CubeTextureLoader()
    const texture = loader.load(['../assets/images/skybox/px.png', '../assets/images/skybox/nx.png', '@/assets/images/skybox/py.png', '../assets/images/skybox/ny.png', '../assets/images/skybox/pz.png', '#/images/skybox/nz.png'])
    texture.encoding = THREE.sRGBEncoding
    scene.background = texture
  }

  createWolrdMesh() {
    /* initial World plane */
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), new THREE.MeshStandardMaterial({ color: 0x808080 }))
    plane.castShadow = false
    plane.receiveShadow = true
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)
  }
}
