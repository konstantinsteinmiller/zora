import camera from '@/engine/Camera.ts'
import { Clock } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import state from '@/states/GlobalState'

let renderer: any = null

export default () => {
  /* renderer is a Singleton */
  if (renderer !== null) {
    return renderer
  }

  const previousTickTime: number | null = null

  const canvas: any = document.querySelector('canvas')
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  })

  renderer.clock = new Clock()

  renderer.setPixelRatio(4)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.physicallyCorrectLights = true

  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75

  const FIXED_TIME_STEP = 1 / 60 // 60 FPS baseline
  let accumulatedTime = 0

  const tick = () => {
    const deltaS = renderer.clock.getDelta()
    accumulatedTime += deltaS

    if (state.isPaused) {
      requestAnimationFrame(tick)
      return
    }

    while (accumulatedTime >= FIXED_TIME_STEP) {
      state.eventsMap?.['renderer.update']?.forEach(({ callback }: any) => {
        callback?.(FIXED_TIME_STEP, renderer.clock.getElapsedTime())
      })
      state.oneTimeEventsList.forEach(({ eventName, callback, cleanup }: any) => {
        if (eventName === 'renderer.update') {
          callback()
          cleanup()
        }
      })
      accumulatedTime -= FIXED_TIME_STEP
    }

    /* auto clear here to be able to render uiScene on top
     * of the animated object scene */
    renderer.autoClear = true
    renderer.render(state.scene, state.camera)
    renderer.autoClear = false
    if (state.showCrosshair) {
      renderer.clearDepth()
      renderer.render(state.uiScene, state.uiCamera)
    }

    requestAnimationFrame(tick)
  }

  const onWindowResize = () => {
    const aspect = innerWidth / innerHeight
    state.camera.aspect = aspect
    state.camera?.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    state.triggerEvent('renderer.resize')
  }

  window.addEventListener('resize', onWindowResize, false)

  /* start game loop */
  renderer.clock.elapsedTime = 0
  renderer.clock.start()
  tick()

  state.renderer = renderer

  return renderer
}
