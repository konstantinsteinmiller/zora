import Rapier, { DebugRenderPipeline } from '@dimforge/rapier3d-compat'
import state from '@/states/GlobalState'
import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three'

export default async () => {
  await Rapier.init()
  const physics = new Rapier.World(new Rapier.Vector3(0, -9.81, 0))
  state.physics = physics

  // Initialize Rapier Debug Renderer
  const debugMaterial = new LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
  const debugGeometry = new BufferGeometry()
  const debugLines = new LineSegments(debugGeometry, debugMaterial)
  let added = false

  state.addEvent('renderer.update', () => {
    physics.step()

    if (state.enableDebug) {
      if (!added) {
        added = true
        state.scene.add(debugLines)
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
