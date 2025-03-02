import FileLoader from '@/engine/FileLoader.ts'
import Sound from '@/engine/Sound.ts'
import state from '@/states/GlobalState'
import { destroyVfx } from '@/utils/vfx.ts'
import { Scene } from 'three'
import Light from '@/engine/Light'
import Renderer from '@/engine/Renderer'
import Physics from '@/engine/Physics'
import Camera from '@/engine/Camera'

export default async (level = 'water-arena') => {
  await Physics()
  state.scene = new Scene()
  state.uiScene = new Scene()

  const levelConfig = await import(`@/entity/levels/${level}/config.ts`)
  const { phi, theta } = levelConfig.startPositions[0]?.orientation || { phi: 0, theta: 0 }

  FileLoader()
  Camera()
  state.thirdPersonCamera.setCameraRotation(phi, theta)
  state.fpsCamera.setCameraRotation(phi, theta)

  Sound()

  Light()
  Renderer()

  state.isEngineInitialized = true
  return true
}

export const cleanupLevel = (excludeBattleProtected = false, removeVfx = false) => {
  state.sounds.stop('background')
  state.sounds.stop('battle')

  state.uiScene.traverse((child: any) => {
    // console.log('child: ', child)
    if (child) {
      state.uiScene.remove(child)
      child.geometry?.dispose?.()
      child.material?.dispose?.()
      child = null
    }
  })
  const childeren: any = []
  state?.scene?.traverse?.((child: any) => {
    if (child) {
      if (excludeBattleProtected && child.isBattleProtected) return
      childeren.push(child)
    }
  })
  childeren.reverse().forEach((child: any) => {
    child.geometry?.dispose?.()
    child.material?.dispose?.()
    state.scene.remove(child)
    child = null
  })
  // console.log('state.scene: ', state.scene

  if (removeVfx) {
    state.vfxList.forEach(({ name, vfxRenderer, nebulaSystem }: any) => {
      setTimeout(() => {
        console.log('name: ', name)
        destroyVfx({ nebulaSystem: nebulaSystem, vfxRenderer })
      }, 3000)
    })
  }
}
