import $ from '@/global'
import { AmbientLight, DirectionalLight, Group, PointLight, Vector2 } from 'three'

export default () => {
  const lightsGroup: any = new Group()
  lightsGroup.name = 'lights-group'
  lightsGroup.isBattleProtected = true

  const ambient: any = new AmbientLight(0xffffff, 1.5)
  ambient.isBattleProtected = true
  const point: any = new PointLight(0xffffff, 0.5)
  point.position.set(1, 0, 4)
  point.castShadow = true
  point.shadow.bias = -0.001
  point.shadow.mapSize = new Vector2(2048, 2048)
  point.isBattleProtected = true

  const light: any = new DirectionalLight(0xffffff, 0.4)
  light.position.set(-100, 100, 100)
  light.target.position.set(0, 0, 0)
  light.castShadow = true
  light.shadow.bias = -0.001
  light.shadow.mapSize.width = 4096
  light.shadow.mapSize.height = 4096
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 500.0
  light.shadow.camera.near = 0.5
  light.shadow.camera.far = 500.0
  light.shadow.camera.left = 50
  light.shadow.camera.right = -50
  light.shadow.camera.top = 50
  light.shadow.camera.bottom = -50
  light.isBattleProtected = true

  lightsGroup.add(light)
  lightsGroup.add(ambient)
  lightsGroup.add(point)

  $.scene.add(lightsGroup)

  const update = () => {
    lightsGroup.position.set(0, 10, 0)
    if ($.player?.position) {
      lightsGroup.position.copy($.player.position)
    }
  }

  $.addEvent('renderer.update', () => {
    update()
  })

  return lightsGroup
}
