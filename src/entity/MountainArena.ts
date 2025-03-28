import AssetLoader from '@/engine/AssetLoader.ts'
import { Object3D } from 'three'
import $ from '@/global'

export default async () => {
  if ($.mountainArena) {
    return $.mountainArena
  }

  $.mountainArena = new Object3D()
  const { loadMesh } = AssetLoader()
  loadMesh(
    'worlds/arenas/mountain-arena.fbx',
    $.mountainArena,
    35 /*, (scene: Object3D) => {
    console.log('callback: ')
    scene.position.set(0, 0.5, 0)
  }*/
  )
  $.mountainArena.position.set(0, 0.5, 0)
  const createColliders = () => {}

  $.mountainArena.name = 'MountainArenaContainer'
  // mesh.objects = objects
  $.scene.add($.mountainArena)

  return $.mountainArena
}
