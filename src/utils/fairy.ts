import type { Fairy } from '@/types/fairy.ts'
import { levelXpMap, tierScaleMap } from '@/utils/enums.ts'
import { pick } from 'lodash'

const BASE_ITERATIONS = 10
export const calcStatGrowth = (maxStat: number, tier: number, maxLevel: number = 50) => {
  const tierScaler: number = tierScaleMap[tier]
  const iterations = BASE_ITERATIONS + maxLevel
  const baseGrowthPerLevel = +(maxStat / tierScaler / iterations).toFixed(3)
  return baseGrowthPerLevel
}

// const levelMap: any = { 1: 0 }
const getFairyRequiredExp = (level: number): number => {
  if (level === 1) {
    return 0
  }
  const xpNeeded: number = levelXpMap[`${level}`] /*level * 3 - 3 + getFairyRequiredExp(level - 1)*/
  // levelMap[level] = xpNeeded
  return xpNeeded
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
  const [xp, nextLevelXp] = [getFairyRequiredExp(targetLevel), getFairyRequiredExp(targetLevel + 1)]

  fairy.xp = xp
  fairy.nextLevelXp = nextLevelXp
  fairy.level = targetLevel
  fairy.stats = { ...fairy.stats, ...clone.stats }
}
