import $ from '@/global.ts'
import { Vector3 } from 'three'
import type { Ref } from 'vue'

export const arcHeight = 0.5 // meters

export const animateArc = (progress: number, wildFairy: Ref<any>) => {
  if ($.player?.mesh && wildFairy.value?.mesh) {
    const playerWorldPosition = new Vector3()
    $.player.mesh.getWorldPosition(playerWorldPosition)
    const playerForwardDirection = new Vector3(0, 0, 1) // Assuming positive Z is forward
    playerForwardDirection.applyQuaternion($.player.mesh.quaternion)

    // Calculate a target position closer to the player's face
    const targetOffset = new Vector3(0, 1.5, 1.5) // Positive Z for forward
    targetOffset.applyQuaternion($.player.mesh.quaternion)
    const targetPosition = new Vector3().addVectors(playerWorldPosition, targetOffset)

    const startPosition = wildFairy.value.mesh.position.clone()

    // Calculate intermediate control points for a smoother Bezier curve
    const controlPoint1Offset = new Vector3().copy(playerForwardDirection).multiplyScalar(arcHeight * 0.75)
    controlPoint1Offset.y += arcHeight * 0.75
    controlPoint1Offset.add(startPosition)

    const controlPoint2Offset = new Vector3().copy(playerForwardDirection).multiplyScalar(arcHeight * 0.75)
    controlPoint2Offset.y += arcHeight * 0.75
    controlPoint2Offset.add(targetPosition)

    const p0 = startPosition
    const p1 = controlPoint1Offset
    const p2 = controlPoint2Offset
    const p3 = targetPosition

    // Function to get a point on the cubic Bezier curve at a given t
    const getPointOnCurve = (t: number) => {
      const mt = 1 - t
      const mt2 = mt * mt
      const t2 = t * t

      const x = mt * mt2 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t * t2 * p3.x
      const y = mt * mt2 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t * t2 * p3.y
      const z = mt * mt2 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t * t2 * p3.z

      return new Vector3(x, y, z)
    }

    // Approximate the total curve length (calculate only once if possible and store it)
    const numSamples = 100
    let totalCurveLength = 0
    let prevPoint = getPointOnCurve(0)
    for (let i = 1; i <= numSamples; i++) {
      const t = i / numSamples
      const currentPoint = getPointOnCurve(t)
      totalCurveLength += currentPoint.distanceTo(prevPoint)
      prevPoint = currentPoint
    }

    // Binary search to find the t value corresponding to the desired arc length
    const targetArcLength = progress * totalCurveLength
    let low = 0
    let high = 1
    let t = progress // Initial guess

    for (let i = 0; i < 15; i++) {
      // Iterate a few times for precision
      const midT = (low + high) / 2
      let currentArcLength = 0
      let searchPrevPoint = getPointOnCurve(0)
      for (let j = 1; j <= numSamples * midT; j++) {
        // Iterate up to numSamples * midT
        const searchT = j / numSamples
        const currentPoint = getPointOnCurve(searchT)
        currentArcLength += currentPoint.distanceTo(searchPrevPoint)
        searchPrevPoint = currentPoint
      }

      if (currentArcLength < targetArcLength) {
        low = midT
      } else {
        high = midT
      }
      t = (low + high) / 2
    }

    const currentPosition = getPointOnCurve(t)
    wildFairy.value.mesh.position.copy(currentPosition)

    // Make the fairy look at the player
    wildFairy.value.mesh.lookAt(playerWorldPosition)
  }
}
