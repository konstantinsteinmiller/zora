import { Clock, WebGLRenderer } from 'three'
import * as THREE from 'three'
import state from '@/states/GlobalState'

export default () => {
  const canvas: any = document.querySelector('canvas')
  let renderer: any = state.renderer
    ? state.renderer
    : new WebGLRenderer({
        canvas,
        antialias: true,
      })

  renderer.clock = new Clock()

  renderer.setPixelRatio(4)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.outputEncoding = (THREE as any).sRGBEncoding
  renderer.physicallyCorrectLights = true

  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75

  const FIXED_TIME_STEP = 1 / 60 // 60 FPS baseline
  let accumulatedTime = 0

  const tick = () => {
    /* exit previous game loop */
    if (!state.isEngineInitialized) return

    const deltaS = renderer.clock.getDelta()
    accumulatedTime += deltaS

    if (state.isPaused) {
      requestAnimationFrame(tick)
      return
    }

    while (accumulatedTime >= FIXED_TIME_STEP) {
      state.oneTimeEventsList.forEach(({ eventName, callback, cleanup }: any) => {
        if (eventName === 'renderer.update') {
          callback()
          cleanup()
        }
      })

      state.eventsMap?.['renderer.update']?.forEach(({ callback }: any) => {
        callback?.(FIXED_TIME_STEP, renderer.clock.getElapsedTime())
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
    state.camera.aspect = innerWidth / innerHeight
    state.camera?.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    state.triggerEvent('renderer.resize')
  }

  window.addEventListener('resize', onWindowResize, false)

  state.addEvent('arena.cleanup', () => {
    window.removeEventListener('resize', onWindowResize, false)
    renderer = null
    state.renderer = null
  })

  /* start game loop */
  renderer.clock.elapsedTime = 0
  renderer.clock.start()

  state.isEngineInitialized = true
  tick()

  state.renderer = renderer

  return renderer
}
