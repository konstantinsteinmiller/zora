import type { Fairy } from '@/types/fairy.ts'
import { levelXpMap, tierScaleMap } from '@/utils/enums.ts'
import { pick } from 'lodash'

const BASE_ITERATIONS: number = 10

const BASE_INCREASE_STEP: number = 0.15
const BASE_INCREASE_HP_STEP: number = 40
const BASE_INCREASE_DEF_STEP: number = 3

interface StatGrowth {
  hp: number
  power: number
  defense: number
  speed: number
  special: number
}
export const getStatGrowth = (
  { hp, power, defense, speed, special }: StatGrowth,
  tier: number,
  maxLevel: number = 50
) => {
  const maxHp = 150 + hp * BASE_INCREASE_HP_STEP /** tierScaleMap[tier]*/
  const maxPower = 0.6 + power * BASE_INCREASE_STEP /** tierScaleMap[tier]*/
  const maxDef = 10 + defense * BASE_INCREASE_DEF_STEP /** tierScaleMap[tier]*/
  const maxSpeed = 0.6 + speed * BASE_INCREASE_STEP /** tierScaleMap[tier]*/
  const maxSpecial = 0.6 + special * BASE_INCREASE_STEP /** tierScaleMap[tier]*/
  return {
    hp: calcStatGrowth(maxHp, tier, maxLevel),
    power: calcStatGrowth(maxPower, tier, maxLevel),
    defense: calcStatGrowth(maxDef, tier, maxLevel),
    speed: calcStatGrowth(maxSpeed, tier, maxLevel),
    special: calcStatGrowth(maxSpecial, tier, maxLevel),
  }
}

export const calcStatGrowth = (maxStat, tier, maxLevel = 50) => {
  // const tierScaler = tierScaleMap[tier]
  const iterations = BASE_ITERATIONS + maxLevel
  const baseGrowthPerLevel = +(maxStat / iterations).toFixed(3)
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

  clone = { stats: pick(fairy.stats, ['hp', 'power', 'defense', 'speed', 'special']) }

  const statGrowthPerLevel: any = getStatGrowth(fairy?.statsGrowthSteps, fairy.tier) || 0

  for (const key in clone.stats) {
    clone.stats[key] = (statGrowthPerLevel?.[key] || 0) * (targetLevel + BASE_ITERATIONS) * tierScaler
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
  // console.log('fairy.stats: ', fairy.stats)
}
