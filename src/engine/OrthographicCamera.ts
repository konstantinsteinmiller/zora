import * as THREE from 'three'

export default class OrthographicCamera extends THREE.PerspectiveCamera {
  constructor() {
    super(60, window.innerWidth / window.innerHeight, 1, 1000)
    this.position.set(6, 50, 14)
    this.lookAt(0, 0, 1.8)
  }

  update(player: any) {
    this.position.copy(player.position)
    this.position.y += 4
    this.position.z += 4
    this.lookAt(player.position)
  }
}
