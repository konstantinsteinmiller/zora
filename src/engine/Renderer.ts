import world from '@/entity/World.ts'
import { Clock, WebGLRenderer } from 'three'
import * as THREE from 'three'
import $ from '@/global'

export default () => {
  const canvas: any = document.querySelector('canvas')
  let renderer: any = $.renderer
    ? $.renderer
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

  // renderer.toneMapping = THREE.CineonToneMapping
  // renderer.toneMappingExposure = 1.75
  renderer.toneMapping = THREE.ACESFilmicToneMapping // Use ACES tone mapping for PBR
  renderer.toneMappingExposure = 1.25 // Adjust exposure to fine-tune brightness

  const FIXED_TIME_STEP = 1 / 60 // 60 FPS baseline
  let accumulatedTime = 0

  const tick = () => {
    /* exit previous game loop */
    if (!$.isEngineInitialized) return

    const deltaS = renderer.clock.getDelta()
    accumulatedTime += deltaS

    if ($.isPaused) {
      requestAnimationFrame(tick)
      return
    }

    while (accumulatedTime >= FIXED_TIME_STEP) {
      $.oneTimeEventsList.forEach(({ eventName, callback, cleanup }: any) => {
        if (eventName === 'renderer.update') {
          callback()
          cleanup()
        }
      })

      $.eventsMap?.['renderer.update']?.forEach(({ callback }: any) => {
        callback?.(FIXED_TIME_STEP, renderer.clock.getElapsedTime())
      })
      accumulatedTime -= FIXED_TIME_STEP
    }

    /* auto clear here to be able to render uiScene on top
     * of the animated object scene */
    renderer.autoClear = true
    renderer.render($.scene, $.camera)
    renderer.autoClear = false
    if ($.showCrosshair) {
      renderer.clearDepth()
      renderer.render($.uiScene, $.uiCamera)
    }

    requestAnimationFrame(tick)
  }

  const onWindowResize = () => {
    $.camera.aspect = innerWidth / innerHeight
    $.camera?.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
    $.triggerEvent('renderer.resize')
  }

  window.addEventListener('resize', onWindowResize, false)

  $.addEvent('level.cleanup', () => {
    window.removeEventListener('resize', onWindowResize, false)
    renderer = null
    $.renderer = null
  })

  /* start game loop */
  renderer.clock.elapsedTime = 0
  renderer.clock.start()

  $.isEngineInitialized = true
  tick()

  $.renderer = renderer

  return renderer
}
