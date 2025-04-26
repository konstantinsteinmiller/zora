import type { Fairy } from '@/types/fairy.ts'
import { tierScaleMap } from '@/utils/enums.ts'
import { pick } from 'lodash'

const BASE_ITERATIONS = 10
export const calcStatGrowth = (maxStat: number, tier: number, maxLevel: number = 50) => {
  const tierScaler: number = tierScaleMap[tier]
  const iterations = BASE_ITERATIONS + maxLevel
  const baseGrowthPerLevel = +(maxStat / tierScaler / iterations).toFixed(3)
  return baseGrowthPerLevel
}

const getFairyRequiredExp = (level: number) => {
  const requiredExp: number = level * BASE_ITERATIONS
}

let clone = null
export const levelUpFairy = (fairy: Fairy, targetLevel: number) => {
  const tierScaler: number = tierScaleMap[fairy.tier]
  const stats = pick(fairy.stats, ['hp', 'power', 'defense', 'speed', 'special'])

  clone = {
    stats,
  }

  for (const key in clone.stats) {
    clone.stats[key] = (fairy?.statGrowthPerLevel?.[key] || 0) * targetLevel * tierScaler
    clone.stats[key] = +clone.stats[key]?.toFixed(3)
  }
  clone.stats['hp'] = Math.round(clone.stats['hp'])
  clone.stats['maxHp'] = clone.stats['hp']
  clone.stats['previousHp'] = clone.stats['hp']
  fairy.level = targetLevel
  fairy.stats = { ...fairy.stats, ...clone.stats }
}
