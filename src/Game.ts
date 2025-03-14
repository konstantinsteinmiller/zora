import FileLoader from '@/engine/FileLoader.ts'
import state from '@/states/GlobalState'
import { destroyVfx } from '@/utils/vfx.ts'
import { Scene } from 'three'
import Light from '@/engine/Light'
import Renderer from '@/engine/Renderer'
import Physics from '@/engine/Physics'

export default async (level = 'water-arena') => {
  await Physics()
  state.scene = new Scene()
  state.uiScene = new Scene()

  state.addEvent('arena.cleanup', () => {
    state.scene = null
    state.uiScene = null
  })

  const levelConfig = await import(`@/entity/levels/${level}/config.ts`)
  const { phi, theta } = levelConfig.startPositions[0]?.orientation || { phi: 0, theta: 0 }

  state.thirdPersonCamera.setCameraRotation(phi, theta)
  state.fpsCamera.setCameraRotation(phi, theta)

  Light()
  Renderer()

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

  if (removeVfx) {
    state.vfxList.forEach(({ name, vfxRenderer, nebulaSystem }: any) => {
      setTimeout(() => {
        // console.log('name: ', name)
        destroyVfx({ nebulaSystem: nebulaSystem, vfxRenderer })
      }, 3000)
    })
  }
  if (!excludeBattleProtected) {
    state.isEngineInitialized = false
    state.isBattleOver = false
    state.isBattleInitialized = false

    const fileLoader = FileLoader()
    fileLoader.clearData()
    state.triggerEvent('arena.cleanup')
    state.clearAllEvents()

    // state.renderer.dispose()
    setTimeout(() => {}, 1000)
  }
}
