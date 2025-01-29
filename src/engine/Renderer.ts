import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default class Renderer extends THREE.WebGLRenderer {
  scene = null
  clock = new THREE.Clock()
  camera = null
  cbUpdate: any = null
  cbPostUpdate: any = null
  cbLoop = null
  previousRAF = null
  orbitControls = null

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

    // this.orbitControls = new OrbitControls(camera, this.domElement)
    // this.orbitControls.target.set(0, 0, 0)
    // this.orbitControls?.update()

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
    // this.orbitControls?.update()

    this.render(scene, camera)
    requestAnimationFrame(this.cbLoop)
    this.step(dt - this.previousRAF)
    this.previousRAF = dt
  }

  step(timeElapsedInMs: number) {
    const timeElapsedInSeconds = timeElapsedInMs * 0.001
    this?.cbPostUpdate?.(timeElapsedInSeconds)
  }

  onUpdate(callback: any) {
    this.cbUpdate = callback
  }

  postUpdate(callback: any) {
    this.cbPostUpdate = callback
  }

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    this.setSize(window.innerWidth, window.innerHeight)
  }
}
