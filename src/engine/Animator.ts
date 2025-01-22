import * as THREE from 'three'
import { findByName } from '../tool/function.js'
import '../tool/overwrite.js'

export default class Animator {
  animationsMap = new Map()
  mixer = null
  clips = null
  currentAnimation = null
  listenersMap = new Map()

  constructor(mesh) {
    this.mixer = new THREE.AnimationMixer(mesh)
    this.clips = mesh.clips
    this.initListeners()
  }

  initListeners() {
    this.mixer.addEventListener('loop', e => {
      this.fireListeners(this.currentAnimation._clip.name, 'loop')
    })
    this.mixer.addEventListener('half', e => {
      this.fireListeners(this.currentAnimation._clip.name, 'half')
    })
  }

  load(name, duration, once) {
    const clip = findByName(name, this.clips)
    const animation = this.mixer.clipAction(clip)
    animation.setDuration(duration)
    once && animation.setLoop(THREE.LoopOnce)
    this.animationsMap.set(name, animation)
    this.listenersMap.set(name, new Map())
  }

  play(name) {
    const animation = this.animationsMap.get(name)
    if (this.currentAnimation && this.currentAnimation !== animation) {
      this.currentAnimation.stop()
    }
    this.currentAnimation = animation
    if (this.currentAnimation?.isRunning()) return
    this.fireListeners(this.currentAnimation._clip.name, 'start')
    this.currentAnimation.play()
  }

  update(dt) {
    this.mixer.update(dt)
  }

  fireListeners(name, event) {
    const listener = this.listenersMap.get(name)
    listener?.get(event)?.()
  }

  on(name, event, callback) {
    this.listenersMap.get(name)?.set(event, callback)
  }
}
