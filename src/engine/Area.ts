import { Box3 } from 'three'

export default class Area extends Box3 {
  type = null

  constructor(areaMesh) {
    super()
    this.type = areaMesh.name.split('_')[1]
    this.copy(areaMesh.geometry.boundingBox)
  }

  in(position) {
    const isColliding = this.containsPoint(position)
    return isColliding ? this.type : null
  }
}
