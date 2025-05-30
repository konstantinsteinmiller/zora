import { assetManager } from '@/engine/AssetLoader.ts'
import { ENERGY_FEMALE_OLD } from '@/Story/Fairies/energy-fairies.ts'
import { ICE_SNOWMAN_YOUNG } from '@/Story/Fairies/ice-fairies.ts'
import { METAL_SCORPION_MIDDLE } from '@/Story/Fairies/metal-fairies.ts'
import { NATURE_BUTTERFLY_MIDDLE } from '@/Story/Fairies/nature-fairies.ts'
import {
  arenaCharacterAnimationNamesList,
  worldCharacterAnimationNamesList,
  worldNPCAnimationNamesList,
} from '@/utils/constants.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { ref } from 'vue'

const loadingProgress = ref(0)
const worldLoadingProgress = ref(0)
const areAllAssetsLoaded = ref(false)

export default () => {
  // const outerWorldAssetsList: string[] = [
  // ]
  const arenaAssetsList: string[] = [
    prependBaseUrl('/draco/draco_decoder.js'),
    '/worlds/arenas/water-arena.comp.glb',
    '/worlds/arenas/water-arena-navmesh.fbx',
    '/models/power-ups/swords.comp.glb',
    '/models/power-ups/breast_plate.comp.glb',
    '/images/glow.png',
    '/images/star/star-64x64.png',
    '/images/fairy-dust/fairy-dust-100x120.png',
    '/images/icons/fairy.png',
    '/images/crosshair/crosshair-transparent.avif',
    '/images/crosshair/crosshair-stars.png',
    '/images/crosshair/crosshair-dots.avif',
    '/images/logo/Zora_logo_512x512.png',
    '/worlds/city-1/city-1.comp.glb',
    '/worlds/embersteel/embersteel.comp.glb',
    '/worlds/city-1/city-1-houses.comp.glb',
    '/worlds/city-1/city-1-navmesh.fbx',
  ]
  const arenaCharacterAnimsList = [
    NATURE_BUTTERFLY_MIDDLE.modelPath,
    ENERGY_FEMALE_OLD.modelPath,
    ICE_SNOWMAN_YOUNG.modelPath,
    // ICE_YETI_YOUNG.modelPath,
    // ICE_YETI_MIDDLE.modelPath,
    // FIRE_HARPY.modelPath,
    // FIRE_DRAGON_OLD.modelPath,
    // PSI_NIGHTMARE.modelPath,
    // NATURE_MOSS.modelPath,
    METAL_SCORPION_MIDDLE.modelPath,
  ]
  const worldCharacterAnimsList = ['/models/fairy-trainer/fairy-trainer.fbx']
  const worldNPCAnimsList = [
    '/models/flf-trader/flf-trader.fbx',
    '/models/friend-trainer/friend-trainer.fbx',
    '/models/none-kid/none-kid.fbx',
  ]

  let promisesLength = 1
  const updateProgress = () => {
    loadingProgress.value += +(100 / promisesLength).toFixed(2)
    worldLoadingProgress.value = loadingProgress.value
  }

  const mapMeshesAndTextures = (src: string) => {
    if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
      return assetManager.loadMesh(src)
    } else if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.avif')) {
      return assetManager.loadTexture(src)
    }
  }

  const preloadAssets = async () => {
    if (areAllAssetsLoaded.value) return
    try {
      // Load assets in parallel
      arenaAssetsList
        .map(mapMeshesAndTextures)
        .concat([
          assetManager.loadCubeTexture([
            '/images/skybox/px.avif',
            '/images/skybox/nx.avif',
            '/images/skybox/py.avif',
            '/images/skybox/ny.avif',
            '/images/skybox/pz.avif',
            '/images/skybox/nz.avif',
          ]),
          // .then(updateProgress),
        ])
        .concat(
          arenaCharacterAnimsList.reduce((acc, src) => {
            if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
              acc.concat(assetManager.loadCharacterAnims({ src, animsList: arenaCharacterAnimationNamesList }))
            }
            return acc
          }, [])
        )
        /* world specific */
        .concat(
          worldCharacterAnimsList.reduce((acc, src) => {
            if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
              acc.concat(assetManager.loadCharacterAnims({ src, animsList: worldCharacterAnimationNamesList }))
            }
            return acc
          }, [])
        )
        /* world specific NPC */
        .concat(
          worldNPCAnimsList.reduce((acc, src) => {
            if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
              acc.concat(assetManager.loadCharacterAnims({ src, animsList: worldNPCAnimationNamesList }))
            }
            return acc
          }, [])
        )
      let resolvedPromises = 0
      promisesLength = assetManager.loadingPromises.length
      await Promise.all(
        assetManager.loadingPromises.map(promise => promise?.then(updateProgress).then(() => resolvedPromises++))
      )

      // outerWorldAssetsList.map(mapMeshesAndTextures)
      // await Promise.all(assetManager.loadingPromises.map(promise => promise?.then(updateWorldProgress)))

      const interval = setInterval(async () => {
        areAllAssetsLoaded.value = true
        assetManager.loadingPromises = []
        // console.log('All assets preloaded successfully', assetManager)

        // console.log('resolvedPromises: ', resolvedPromises, promisesLength)
        if (resolvedPromises === promisesLength) {
          // console.log('done - resolvedPromises: ', resolvedPromises, promisesLength)
          loadingProgress.value = 100
          worldLoadingProgress.value = loadingProgress.value
        }
        interval && clearInterval(interval)
      }, 200)
    } catch (error) {
      console.error('Asset loading error:', error)
    }
  }

  return {
    loadingProgress,
    worldLoadingProgress,
    preloadAssets,
  }
}
