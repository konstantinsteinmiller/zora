import $ from '@/global'
import { AxesHelper } from 'three'

export default () => {
  const axesHelper = new AxesHelper(2)

  $.addEvent('renderer.update', () => {
    axesHelper.position.copy($.player.getPosition())
    axesHelper.position.y = axesHelper.position.y + 1.8
    axesHelper.quaternion.copy($.player.getRotation())
  })
  $.scene.add(axesHelper)

  return axesHelper
}
