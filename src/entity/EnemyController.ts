import * as THREE from 'three'
import state from '@/states/GlobalState'

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
    const player = state.player

    const directionVector: THREE.Vector3 = player.getPosition().clone()
    directionVector.sub(this.position)
    directionVector.y = 0

    return directionVector
  }
}
