import camera from '@/engine/Camera.ts'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import state from '@/states/GlobalState'

let renderer: any = null

export default () => {
  /* renderer is a Singleton */
  if (renderer !== null) {
    return renderer
  }

  let previousTickTime: number | null = null

  const canvas: any = document.querySelector('canvas')
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  })

  renderer.clock = new THREE.Clock()

  renderer.setPixelRatio(4)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.physicallyCorrectLights = true

  renderer.toneMapping = THREE.CineonToneMapping
  renderer.toneMappingExposure = 1.75

  previousTickTime = null

  renderer.onUpdate = (callback: any) => {
    renderer.cbUpdate = callback
  }

  const tick = () => {
    requestAnimationFrame((time: number) => {
      if (previousTickTime === null) {
        previousTickTime = time
      }
      const elapsedTime = renderer.clock.getElapsedTime()

      const elapsedTimeInMs = time - previousTickTime
      const elapsedTimeInS = elapsedTimeInMs * 0.001

      if (renderer.cbUpdate) {
        renderer.cbUpdate(elapsedTimeInS)
      }
      state.eventsMap?.['renderer.update']?.forEach(({ callback }: any) => {
        callback?.(elapsedTimeInS, elapsedTime)
      })
      // this.orbitControls?.update()
      /* auto clear here to be able to render uiScene on top
       * of the animated object scene */
      renderer.autoClear = true
      renderer.render(state.scene, state.camera)
      renderer.autoClear = false
      if (state.showCrosshair) {
        renderer.render(state.uiScene, state.uiCamera)
      }

      previousTickTime = time

      tick()
    })
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  /* start game loop */
  tick()

  state.renderer = renderer

  return renderer
}
