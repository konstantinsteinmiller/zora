import Rapier from '@dimforge/rapier3d-compat'
import state from '@/states/GlobalState'

export default async () => {
  await Rapier.init()
  const physics = new Rapier.World(new Rapier.Vector3(0, -9.81, 0))
  state.physics = physics

  state.addEvent('renderer.update', () => {
    physics.step()
  })

  return physics
}
