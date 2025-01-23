import * as THREE from 'three'

export default class Camera extends THREE.PerspectiveCamera {
  constructor() {
    super(/*70*/ 45, window.innerWidth / window.innerHeight, 0.1, 1000)
    // this.position.set(0, 5.4, 9)
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
