import * as THREE from 'three'

export default class EnemyController {
  constructor() {
    this.enemiesList = []
    this.init()
  }

  init() {
    this.createEnemies()
  }

  createEnemies() {
    const enemy = new Enemy()
    this.enemiesList.push(enemy)
  }

  findPlayer() {
    const player = window.player

    const directionVector: THREE.Vector3 = player.getPosition.clone()
    directionVector.sub(this.position)
    directionVector.y = 0

    return directionVector
  }
}
