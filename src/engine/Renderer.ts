import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export default class Renderer extends THREE.WebGLRenderer {
  clock = new THREE.Clock()
  cbUpdate: any = null
  cbPostUpdate: any = null
  cbLoop = null
  previousRAF = null
  orbitControls = null
  eventsList: { id: string; callback: () => void }[] = []

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

    this.clock = new THREE.Clock()

    this.setPixelRatio(4)
    this.cbLoop = this.loop.bind(this)
    this.shadowMap.enabled = true
    this.shadowMap.type = THREE.PCFSoftShadowMap

    this.outputEncoding = THREE.sRGBEncoding
    this.physicallyCorrectLights = true

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
    requestAnimationFrame((t: number) => {
      if (this.previousRAF === null) {
        this.previousRAF = t
      }
      const elapsedTime = this.clock.getElapsedTime()

      const elapsedTimeInMs = t - this.previousRAF
      const elapsedTimeInS = elapsedTimeInMs * 0.001

      if (this.cbUpdate) {
        this.cbUpdate(elapsedTimeInS, elapsedTime)
      }
      // this.orbitControls?.update()
      /* autoclear here to be able to render uiScene on top of the animated
       * object scene */
      this.autoClear = true
      this.render(scene, camera)
      this.autoClear = false
      if (window.showCrosshair) {
        this.render(uiScene, uiCamera)
      }

      this.step(elapsedTimeInMs)
      this.eventsList.forEach(({ callback }) => {
        callback?.(elapsedTimeInS)
      })
      this.previousRAF = t

      this.loop()
    })
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

  public addEvent(id: string, callback: any) {
    this.eventsList.push({ id, callback })
  }

  public removeEvent(eventId: string) {
    this.eventsList = this.eventsList.filter(({ id }) => eventId !== id)
  }
}
