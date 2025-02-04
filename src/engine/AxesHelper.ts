import state from '@/states/GlobalState.ts'
import { AxesHelper } from 'three'

export default () => {
  const axesHelper = new AxesHelper(2)

  state.addEvent('renderer.update', () => {
    axesHelper.position.copy(state.player.getPosition())
    axesHelper.position.y = axesHelper.position.y + 1.8
    axesHelper.quaternion.copy(state.player.getRotation())
  })
  state.scene.add(axesHelper)

  return axesHelper
}
