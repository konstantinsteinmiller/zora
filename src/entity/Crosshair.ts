import * as THREE from 'three'
import state from '@/states/GlobalState'

export default () => {
  const textureLoader = new THREE.TextureLoader()
  const crosshair = textureLoader.load('images/crosshair/crosshair-white.png')
  crosshair.anisotropy = state.renderer.capabilities.getMaxAnisotropy()

  const crosshairSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: crosshair, color: 0xffffff, fog: false, depthTest: false, depthWrite: false }))
  crosshairSprite.scale.set(0.15 / state.camera.aspect, 0.15 * state.camera.aspect, 1)
  crosshairSprite.position.set(0, 0, -10)

  state.uiScene.add(crosshairSprite)
}