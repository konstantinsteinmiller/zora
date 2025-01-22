import * as THREE from 'three'

export default class Light extends THREE.Object3D {
  constructor() {
    super()
    const ambient = new THREE.AmbientLight(0xffffff, 1.9)
    const point = new THREE.PointLight(0xffffff, 1)
    point.position.set(1, 0, 4)
    point.castShadow = true
    point.shadow.bias = -0.001
    point.shadow.mapSize = new THREE.Vector2(2048, 2048)

    this.add(ambient)
    this.add(point)
  }

  update(player) {
    this.position.copy(player.position)
  }
}
