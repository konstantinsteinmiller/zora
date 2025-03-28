import Stats from 'stats-gl'
import $ from '@/global'

export default () => {
  // create a new Stats object
  const stats = new Stats({
    trackGPU: false,
    trackHz: false,
    trackCPT: false,
    logsPerSecond: 4,
    graphsPerSecond: 30,
    samplesLog: 40,
    samplesGraph: 10,
    precision: 2,
    horizontal: true,
    minimal: false,
    mode: 0,
  })

  document.body.appendChild(stats.dom)
  stats.begin()

  $.addEvent('renderer.update', () => {
    stats.update()
  })
}
