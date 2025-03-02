import state from '@/states/GlobalState.ts'
import { randomInt } from '@/utils/function.ts'
import { Audio, AudioListener, AudioLoader, Group, PositionalAudio } from 'three'

const isProduction = import.meta.env.NODE_ENV === 'production'
const prependBaseUrl = (url: string): string => (isProduction ? `/zora${url}` : url)
const repeat = (n: number, callback: (_: any, i: number) => string): string[] => [...new Array(n)].map(callback)

export const soundToTrackSrcMap: { [key: string]: string[] } = {
  hit: repeat(5, (_, i) => prependBaseUrl(`/sounds/auahhhh-hurt-female-${i + 1}.ogg`)),
  spellShot: [prependBaseUrl('/sounds/zushhh_flying_spell.ogg'), prependBaseUrl('/sounds/flying_spell.ogg')],
  flap: repeat(4, (_, i) => prependBaseUrl(`/sounds/flying-flap-${i + 1}.ogg`)),
  death: repeat(3, (_, i) => prependBaseUrl(`/sounds/death-${i + 1}.ogg`)),
  background: [
    prependBaseUrl('/music/thunderous-march_battle.ogg'),
    prependBaseUrl('/music/beneath-the-soft-moonlight_slow-harmonic-beautiful_background-music.ogg'),
    prependBaseUrl('/music/shadows-in-silence_slow-tired-powerless_main-menu.ogg'),
  ],
}

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  /* create camera listener */
  const listener = new AudioListener()
  state.camera.add(listener)

  const audioLoader = new AudioLoader(state.loadingManager)

  singleton = {
    trackBuffersMap: new Map(),
    soundToTrackSrcMap,
  }

  singleton.createSounds = ({
    name,
    loop = false,
    volume = 1.0,
    refDist = 0,
    limit,
    random,
  }: {
    name: string
    loop: boolean
    random?: boolean
    volume: number
    refDist?: number
    limit?: number
  }): any[] => {
    const buffersList = singleton.trackBuffersMap.get(name)
    if (!buffersList || buffersList.length === 0) return []

    const soundsList: any[] = []
    const createSound = (buffer: any) => {
      const sound: any = refDist > 0 ? new PositionalAudio(listener) : new Audio(listener)
      sound.setBuffer(buffer)
      sound.setLoop(loop)
      sound.setVolume(volume)
      if (refDist >= 0) sound.setRefDistance(refDist)
      return sound
    }

    if (random) {
      const random = randomInt(buffersList.length - 1)
      return [createSound(buffersList[random])]
    }

    /* return a list of all tracks for sound name */
    buffersList.forEach((buffer: AudioBuffer, index: number) => {
      if (limit && index >= limit) return
      const sound = createSound(buffer)
      soundsList.push(sound)
    })
    return soundsList
  }
  singleton.isSoundLoaded = (name: string) => {
    return singleton.trackBuffersMap.has(name)
  }

  singleton.load = (name: string, onProgress: () => number) => {
    const srcList = soundToTrackSrcMap[name]
    const trackBuffersList: AudioBuffer[] = []
    let counter = 0
    srcList.forEach((src: string) => {
      state.loadingManager.itemStart(src)
      audioLoader.load(
        src,
        buffer => {
          counter++
          trackBuffersList.push(buffer)

          if (counter === srcList.length) {
            singleton.trackBuffersMap.set(name, trackBuffersList)
          }
          state.loadingManager.itemEnd(src)
        },
        onProgress,
        error => {
          console.error(`Error loading ${src}:`, error)
          state.loadingManager.itemError(src)
        }
      )
    })
  }

  singleton.play = (
    name: string,
    options: {
      volume: number
      loop: boolean
      refDist: number
    }
  ) => {
    const buffersList = singleton.trackBuffersMap.get(name)
    if (!buffersList || buffersList.length === 0) {
      console.warn(`Sound '${name}' is not loaded.`)
      return
    }
    // const index = Math.floor(Math.random() * buffersList.length)
    const sound = singleton.createSounds({
      name,
      random: true,
      refDist: options.refDist,
      volume: options.volume,
      loop: options.loop,
    })[0]
    if (sound) sound.play()
  }

  singleton.playRandomTrack = (soundsList: any[]) => {
    const random = randomInt(soundsList.length - 1)
    const sound = soundsList[random]
    sound.play()
  }
  singleton.attachToParent = (sound: PositionalAudio, owner: any) => {
    let soundsGroup = owner.mesh.children.find((child: any) => child.name === 'sounds-group')
    if (!soundsGroup) {
      soundsGroup = new Group()
      soundsGroup.name = 'sounds-group'
      soundsGroup.add(sound)
      owner.mesh.add(soundsGroup)
    } else {
      const foundOldSound = soundsGroup.children.find((child: any) => child.name === 'hit')
      if (foundOldSound) {
        soundsGroup.remove(foundOldSound)
        soundsGroup.add(sound)
      }
    }
  }
  singleton.addAndPlayPositionalSound = (
    entity: any,
    name: string,
    options: {
      volume: number
      loop?: boolean
      refDist?: number
    }
  ) => {
    if (state.sounds.isSoundLoaded(name)) {
      const positionalSound = state.sounds
        .createSounds({
          name,
          volume: options?.volume || 0.7,
          refDist: options?.refDist || 150,
          random: true,
        })
        .pop()

      positionalSound.name = name
      state.sounds.attachToParent(positionalSound, entity)
      positionalSound.play()
    }
  }

  // Object.keys(soundToTrackSrcMap).forEach((name: string) => singleton.load(name, audioLoader, loadingManager))
  //
  // loadingManager.onLoad = () => {
  //   console.log('%c All sound assets loaded', 'color: lightgrey')
  //   if (state.isBattleOngoing) {
  //     singleton.play('background', { volume: 0.01, loop: true })
  //   }
  // }
  singleton.loadSounds = () => {
    const soundNamesList = Object.keys(soundToTrackSrcMap)

    if (!singleton.trackBuffersMap?.length) {
      soundNamesList.forEach((name: string) =>
        state.sounds.load(name, (event: any) => state.fileLoader.onFileProgress(name, event))
      )
      return
    }
  }

  state.sounds = singleton

  return singleton
}
