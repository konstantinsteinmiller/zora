import { getSrc } from '@/utils/function.js'

export default class Sound {
  tracks = new Map()

  load(name) {
    const srcList = getSrc(name)
    const tracksList = []
    srcList.forEach(src => {
      const audio = new Audio(src)
      tracksList.push(audio)
    })
    this.tracks.set(name, tracksList)
  }

  play(name) {
    const track = this.tracks.get(name)
    const index = Math.floor(Math.random() * track.length)
    track[index].currentTime = 0
    track[index].play()
  }

  // stop(name) {
  //   const track = this.tracks.get(name)
  //   track.stop()
  // }
  //
  // update(player) {
  //   this.tracks.forEach(track => {
  //     track.position.copy(state.player.getPosition())
  //   })
  // }
}
