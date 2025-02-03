import * as THREE from 'three'
import state from '@/states/GlobalState'

export default () => {
  const object = new THREE.Object3D()

  const ambient = new THREE.AmbientLight(0xffffff, 1.5)
  const point = new THREE.PointLight(0xffffff, 0.5)
  point.position.set(1, 0, 4)
  point.castShadow = true
  point.shadow.bias = -0.001
  point.shadow.mapSize = new THREE.Vector2(2048, 2048)

  const light = new THREE.DirectionalLight(0xffffff, 0.4)
  light.position.set(-100, 100, 100)
  light.target.position.set(0, 0, 0)
  light.castShadow = true
  light.shadow.bias = -0.001
  light.shadow.mapSize.width = 4096
  light.shadow.mapSize.height = 4096
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 500.0
  light.shadow.camera.near = 0.5
  light.shadow.camera.far = 500.0
  light.shadow.camera.left = 50
  light.shadow.camera.right = -50
  light.shadow.camera.top = 50
  light.shadow.camera.bottom = -50

  object.add(light)
  object.add(ambient)
  object.add(point)

  state.scene.add(object)

  const update = () => {
    object.position.set(0, 10, 0)
    if (state.player?.position) {
      object.position.copy(state.player.position)
    }
  }

  state.addEvent('renderer.update', () => {
    update()
  })

  return object
}
