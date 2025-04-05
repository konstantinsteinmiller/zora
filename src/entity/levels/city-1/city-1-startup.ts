import $ from '@/global'
import { spawnNpc } from '@/utils/world.ts'

export default () => {
  // console.log('city-1-startup')
  spawnNpc('flf_trader', 'WP_flf_trader')
}
