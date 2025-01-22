import * as THREE from 'three'

export default class Graphic extends THREE.WebGLRenderer {
  scene = null
  clock = new THREE.Clock()
  camera = null
  cbUpdate = null
  cbLoop = null

  constructor(scene, camera) {
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
    this.scene = scene
    this.camera = camera
    this.cbLoop = this.loop.bind(this)
    this.shadowMap.enabled = true
    this.outputEncoding = THREE.sRGBEncoding
    this.toneMapping = THREE.CineonToneMapping
    this.toneMappingExposure = 1.75
    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap

    this.loop()
  }

  loop() {
    const dt = this.clock.getDelta()
    if (this.cbUpdate) {
      this.cbUpdate(dt)
    }
    this.render(this.scene, this.camera)
    requestAnimationFrame(this.cbLoop)
  }
  onUpdate(callback) {
    this.cbUpdate = callback
  }
}
