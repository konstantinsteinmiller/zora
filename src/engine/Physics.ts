import Rapier from '@dimforge/rapier3d-compat'
import $ from '@/global'
import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three'

export default async () => {
  await Rapier.init()
  const eventQueue = new Rapier.EventQueue(true)
  const physics = new Rapier.World(new Rapier.Vector3(0, -9.81, 0))
  $.physics = physics

  // Initialize Rapier Debug Renderer
  const debugMaterial = new LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
  const debugGeometry = new BufferGeometry()
  const debugLines = new LineSegments(debugGeometry, debugMaterial)
  let added = false

  $.addEvent('renderer.update', (deltaS: number) => {
    physics.step(eventQueue)

    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const colliderA = $.physics.getCollider(handle1)
      const colliderB = $.physics.getCollider(handle2)

      $.eventsMap?.['physics.collision']?.forEach(({ callback }: any) => {
        callback?.(colliderA, colliderB, started, deltaS)
      })
    })

    if ($.enableDebug) {
      if (!added) {
        added = true
        $.scene.add(debugLines)
      }
      // Update the debug renderer
      const { vertices } = physics.debugRender()
      if (vertices.length > 0) {
        debugGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3))
        debugGeometry.computeBoundingSphere()
      }
    }
  })

  return physics
}
