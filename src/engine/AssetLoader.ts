import { prependBaseUrl } from '@/utils/function.ts'
import {
  AnimationMixer,
  BoxGeometry,
  CubeTextureLoader,
  type Group,
  LoadingManager,
  Mesh,
  Object3D,
  type Quaternion,
  type Scene,
  Texture,
  TextureLoader,
  Vector3,
} from 'three'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

let loader: any = null
import $ from '@/global'

const isWPOrFP = (child: any) => child.name.startsWith('WP_') || child.name.startsWith('FP_')

const AssetManager = () => {
  type AssetType = 'model' | 'anim' | 'texture'
  type AssetKey = string

  interface AssetContainer {
    models: Record<AssetKey, THREE.Group | THREE.Scene>
    anims: { [key: string]: Record<AssetKey, { clip: any; action: any }> }
    textures: Record<AssetKey, THREE.Texture>
    WPsMap: Map<string, WP>
  }

  interface WP {
    name: string
    position: Vector3
    quaternion: Quaternion
  }

  const assets: AssetContainer = {
    models: {},
    anims: {},
    textures: {},
    WPsMap: new Map<string, WP>(),
  }

  const loadingPromises: Promise<void>[] = []
  function loadMesh(src: string) {
    const isGLTF = src.endsWith('.glb') || src.endsWith('.gltf')
    const isFBX = src.endsWith('.fbx')

    $.loadingManager.itemStart(src)
    const loader: any = isFBX ? new FBXLoader($.loadingManager) : new GLTFLoader($.loadingManager)
    if (!isGLTF && !isFBX) {
      console.warn('Unsupported file type for model loading:', src)
      return Promise.reject(new Error(`Unsupported file type: ${src}`))
    }

    const promise = new Promise<void>((resolve, reject) => {
      if (src.endsWith('.comp.glb')) {
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath(prependBaseUrl('/draco/'))
        dracoLoader.setDecoderConfig({ type: 'js' })
        loader.setDRACOLoader(dracoLoader)
      }

      loader.load(
        prependBaseUrl(src),
        (model: any) => {
          if (isFBX) {
            assets.models[src] = model
          } else if (isGLTF) {
            assets.models[src] = model.scene
          }

          /* add WPs from scene to WPsMap */
          if (assets.models[src]?.children.some(child => isWPOrFP(child))) {
            assets.models[src].children.forEach(child => {
              if (isWPOrFP(child) && assets.WPsMap) {
                assets.WPsMap.set(child.name, {
                  name: child.name,
                  position: child.position,
                  quaternion: child.quaternion,
                })
              }
            })
            // console.log('$.level.WPsMap: ', assets.WPsMap)
          }
          $.loadingManager.itemEnd(src)
          $.triggerEvent(`${src}.loaded`)
          resolve()
        },
        (fileProgressEvent: any) => $.fileLoader.onFileProgress(src, fileProgressEvent),
        (error: any) => ($.loadingManager.itemError(src), reject(error))
      )
    })

    loadingPromises.push(promise)
    return promise
  }

  interface LoadAnimProps {
    src: string
    fullPath: string
    name: string
    mixer: any
    animLoader: any
  }
  function loadAnim({ src, fullPath, name, mixer, animLoader }: LoadAnimProps): Promise<any> {
    const promise = new Promise<void>((resolve, reject) => {
      $.loadingManager.itemStart(fullPath)
      animLoader.load(
        `${name}.fbx`,
        (anim: any) => {
          const clip = anim.animations[0]
          const action: any = mixer.clipAction(clip)
          action.name = name

          assets.anims[src][name] = {
            clip: clip,
            action: action,
          }
          $.loadingManager.itemEnd(fullPath)
          resolve()
        },
        (fileProgressEvent: any) => $.fileLoader.onFileProgress(fullPath, fileProgressEvent),
        () => ($.loadingManager.itemError(fullPath), reject())
      )
    })

    loadingPromises.push(promise)
    return promise
  }

  interface CharacterAnimsProps {
    src: string
    animsList: string[]
  }
  function loadCharacterAnims({ src, animsList }: CharacterAnimsProps): Promise<any>[] {
    const pathPartsList = src.split('/')
    pathPartsList.pop()
    const animationsPath = prependBaseUrl(`${pathPartsList.join('/')}/`)

    const meshPromise = loadMesh(src)

    let animPromisesList: any[]
    const promise = new Promise<void>((resolve, reject) => {
      $.addEvent(`${src}.loaded`, () => {
        const mesh = getModel(src)?.clone() || new Mesh()
        const mixer: AnimationMixer = new AnimationMixer(mesh)
        assets.anims[src] = {}

        /* load all animations from same folder as the models
         * path and add to animationsMap */
        const animLoader = new FBXLoader($.loadingManager)
        animLoader.setPath(animationsPath)
        animPromisesList = animsList.map((name: string) => {
          const fullPath = `${animationsPath}${name}`
          return loadAnim({ src, fullPath, mixer, name, animLoader })
        })
        loadingPromises.concat(animPromisesList)
        resolve()
      })
    })

    loadingPromises.push(meshPromise)
    return [meshPromise].concat(animPromisesList)
  }

  function loadTexture(src: string): Promise<void> {
    const textureLoader = new TextureLoader($.loadingManager)
    $.loadingManager.itemStart(src)
    const promise = new Promise<void>((resolve, reject) => {
      textureLoader.load(
        prependBaseUrl(src),
        texture => {
          assets.textures[src] = texture
          $.loadingManager.itemEnd(src)
          resolve()
        },
        (fileProgressEvent: any) => $.fileLoader.onFileProgress(src, fileProgressEvent),
        error => ($.loadingManager.itemError(src), reject(error))
      )
    })

    loadingPromises.push(promise)
    return promise
  }

  function loadCubeTexture(srcList: string[]): Promise<void> {
    if (srcList.length === 0) {
      console.warn('empty srcList: ', srcList, srcList.length)
      return
    }

    const key = srcList[0]
    const textureLoader = new CubeTextureLoader($.loadingManager)
    $.loadingManager.itemStart(key)
    const promise = new Promise<void>((resolve, reject) => {
      textureLoader.load(
        srcList.map(src => prependBaseUrl(src)),
        texture => {
          assets.textures[key] = texture
          $.loadingManager.itemEnd(key)
          resolve()
        },
        (fileProgressEvent: any) => $.fileLoader.onFileProgress(key, fileProgressEvent),
        error => ($.loadingManager.itemError(key), reject(error))
      )
    })

    loadingPromises.push(promise)
    return promise
  }

  function getTexture(src: string): Texture | undefined {
    return assets.textures[src]
  }

  function getModel(src: string): Mesh | Group | Scene | undefined {
    return assets.models[src]
  }

  function getAnims(src: string): any {
    return assets.anims[src]
  }

  async function preloadAll(): Promise<boolean> {
    try {
      await Promise.all(loadingPromises)
      return true
    } catch (error) {
      console.error('Preloading failed:', error)
      return false
    }
  }

  return {
    assets,
    loadingPromises,
    loadMesh,
    loadCharacterAnims,
    loadTexture,
    loadCubeTexture,
    getTexture,
    getModel,
    getAnims,
    preloadAll,
  }
}
export const assetManager = AssetManager()

export default () => {
  if (loader !== null) {
    return loader
  }

  loader = {}

  loader.loadMesh = async (
    src: string,
    parent: Object3D,
    scale: number = 0.01,
    shadows: boolean = true,
    callback?: (scene: Object3D) => void /*
     */
  ) => {
    if (!src) {
      const emptyMesh = new Mesh(
        new BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false })
      )
      emptyMesh.name = 'empty-mesh'
      parent.add(emptyMesh)
      return Promise.resolve(emptyMesh)
    }

    if (!assetManager.getModel(src)) {
      console.log('missing model, why?: ', src)
      try {
        await assetManager.loadMesh(src)
      } catch (error) {
        return Promise.reject(error)
      }
    }

    const model: any = assetManager.getModel(src)?.clone()
    // console.log('model: ', model)
    model.traverse((child: any) => {
      if (child instanceof Mesh) {
        // console.log('child: ', child)
        if (scale >= 0) child.scale.setScalar(scale)
        child.material.map.encoding = (THREE as any).sRGBEncoding
        if (shadows) {
          child.castShadow = true
          child.receiveShadow = true
        }
        child = createGeoIndex(child)
        parent.add(child)
      }
    })

    // src.endsWith('.comp.glb') && console.log('Compressed GLB loaded!')

    callback?.(model)
    return model
  }

  interface CharacterWithAnimationsProps {
    modelPath: string
    parent: Object3D
    position?: Vector3
    scale: number
    animationNamesList: string[]
    stateMachine: any
    animationsMap: any
    shadows?: boolean
    callback?: (scene: Object3D) => void /*
     */
  }
  loader.loadCharacterModelWithAnimations = async ({
    modelPath: src,
    parent,
    position,
    scale,
    animationNamesList,
    stateMachine,
    animationsMap,
    shadows = true,
    callback,
  }: CharacterWithAnimationsProps) => {
    const loader = new FBXLoader($.loadingManager)
    const pathPartsList = src.split('/')
    pathPartsList.pop()
    const animationsPath = prependBaseUrl(`${pathPartsList.join('/')}/`)

    $.loadingManager.itemStart(src)
    loader.load(
      prependBaseUrl(src),
      (model: any) => {
        $.loadingManager.itemEnd(src)

        if (scale >= 0) model.scale.setScalar(scale)
        // const socket = model.getObjectByName('right_hand_socket')
        // console.log('socket: ', socket)
        if (shadows) {
          model.traverse((c: any) => {
            c.castShadow = true
          })
        }

        /* check for all meshes if they have index data and add if needed */
        model.isBattleProtected = true
        model.traverse((child: any) => {
          if (child.isMesh) {
            child = createGeoIndex(child)
            child.meshName = 'characterMesh'
            child.isBattleProtected = true
          }
        })
        if (position) model.position.copy(position)
        const mesh = model
        parent.add(mesh)

        const mixer: AnimationMixer = new AnimationMixer(mesh)

        /* as soon as all animations where loaded, set stateMachine to idle state */
        const loadingManager = new LoadingManager()
        loadingManager.onLoad = () => {
          if (callback) {
            const scope: any = {
              mixer,
              mesh,
              animationsMap,
            }
            callback?.(scope)
          }
          stateMachine.setState('idle')
        }

        /* When the animation was loaded, add to animationsMap */
        const onLoad = (animName: string, anim: any) => {
          const clip = anim.animations[0]
          const action: any = mixer.clipAction(clip)
          action.name = animName

          animationsMap[animName] = {
            clip: clip,
            action: action,
          }
          $.loadingManager.itemEnd(animName)
        }

        /* load all animations from same folder as the models
         * path and add to animationsMap */
        const animLoader = new FBXLoader(loadingManager)
        animLoader.setPath(animationsPath)
        animationNamesList.forEach((name: string) => {
          $.loadingManager.itemStart(name)
          animLoader.load(
            `${name}.fbx`,
            (anim: any) => onLoad(name, anim),
            (fileProgressEvent: any) => $.fileLoader.onFileProgress(name, fileProgressEvent),
            () => $.loadingManager.itemError(name) /*
             */
          )
        })
      },
      (fileProgressEvent: any) => $.fileLoader.onFileProgress(src, fileProgressEvent),
      () => $.loadingManager.itemError(src)
    )
  }

  return loader
}

export const loadNavMesh = async (src: string, callback: (navMesh: Mesh) => void) => {
  let navMesh: any = assetManager.getModel(src)?.clone()
  if (!navMesh) {
    console.warn('NavMesh not found, loading...')
    try {
      await assetManager.loadMesh(src)
      navMesh = assetManager.getModel(prependBaseUrl(src))?.clone()
    } catch (error) {
      console.error('Failed to load nav mesh:', error)
      return
    }
  }
  callback(navMesh?.children[0])
}

export function createGeoIndex(mesh: Mesh) {
  // Check if the geometry has an index
  if (!mesh?.geometry?.index) {
    let geometry = mesh.geometry
    // console.warn('FBX geometry is non-indexed. Converting...')
    // Convert to indexed geometry
    geometry = BufferGeometryUtils.mergeVertices(geometry)
    geometry.computeVertexNormals()
    // geometry.index.array = geometry.index.array.map((v: number, i: number) => (v *= 100))
    // console.log('Indexed Geometry:', geometry.index) // Should now exist

    // Assign updated geometry back to the mesh
    mesh.geometry = geometry
  }

  return mesh
}
