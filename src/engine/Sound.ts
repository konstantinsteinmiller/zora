import state from '@/states/GlobalState.ts'
import useUser from '@/use/useUser.ts'
import { prependBaseUrl, randomInt, repeat } from '@/utils/function.ts'
import { Audio, AudioListener, AudioLoader, Group, PositionalAudio } from 'three'
import { EventEmitter } from 'events'
import { watch } from 'vue'

export const soundToTrackSrcMap: { [key: string]: string[] } = {
  hit: repeat(5, (_, i) => prependBaseUrl(`/sounds/auahhhh-hurt-female-${i + 1}.ogg`)),
  spellShot: [prependBaseUrl('/sounds/zushhh_flying_spell.ogg'), prependBaseUrl('/sounds/flying_spell.ogg')],
  flap: repeat(4, (_, i) => prependBaseUrl(`/sounds/flying-flap-${i + 1}.ogg`)),
  death: repeat(3, (_, i) => prependBaseUrl(`/sounds/death-${i + 1}.ogg`)),
  battle: [prependBaseUrl('/music/thunderous-march_battle.ogg')],
  battleEnd: [prependBaseUrl('/music/drifting_through_quiet_valleys_slow-beautiful-ocarina-like_battle-end.ogg')],
  background: [
    prependBaseUrl('/music/beneath-the-soft-moonlight_slow-harmonic-beautiful_background-music.ogg'),
    // prependBaseUrl('/music/shadows-in-silence_slow-tired-powerless_main-menu.ogg'),
  ],
}

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  const { userMusicVolume } = useUser()
  /* create camera listener */
  const emitter = new EventEmitter()
  const listener = new AudioListener()
  state.addOneTimeEvent('renderer.update', () => state.camera.add(listener))
  watch(
    () => userMusicVolume.value,
    () => {
      activeSoundsList.forEach((sound: any) => sound.setVolume(userMusicVolume.value * 0.25))
    }
  )

  const audioLoader = new AudioLoader(state.loadingManager)

  singleton = {
    trackBuffersMap: new Map(),
    soundToTrackSrcMap,
    emitter,
  }

  const activeSoundsList: any[] = []

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
      sound.name = name
      if (refDist > 0) sound?.setRefDistance?.(refDist)
      activeSoundsList.push(sound)
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
          singleton.emitter.emit('loaded:background', { name })
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
      refDist: options.refDist || 0,
      volume: options.volume,
      loop: options.loop,
    })[0]
    if (sound) sound.play()
  }
  singleton.stop = (name: string) => {
    activeSoundsList.find((sound: any) => sound.name === name)?.stop()
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

  singleton.loadSounds = () => {
    const soundNamesList = Object.keys(soundToTrackSrcMap)

    if (!singleton.trackBuffersMap?.length) {
      soundNamesList.forEach((name: string) =>
        state.sounds.load(name, (event: any) => state.fileLoader.onFileProgress(name, event))
      )
    }
  }
  singleton.loadBackgroundMusic = () => {
    const name = 'background'
    state.sounds.load(name, (event: any) => state.fileLoader.onFileProgress(name, event))
  }

  singleton.playBackgroundMusic = () => {
    const name = 'background'
    if (!singleton.trackBuffersMap.get(name)) {
      singleton.load(name)

      const onLoadedBackgroundMusic = () => {
        /*!state.isDebug && */ singleton.play(name, { volume: userMusicVolume.value * 0.25, loop: true })
        emitter.off(`loaded:${name}`, onLoadedBackgroundMusic)
      }
      emitter.on(`loaded:${name}`, onLoadedBackgroundMusic)
    } else {
      singleton.play(name, { volume: userMusicVolume.value * 0.25, loop: true })
    }
  }

  state.sounds = singleton

  return singleton
}
