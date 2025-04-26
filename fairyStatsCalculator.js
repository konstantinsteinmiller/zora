class FairyLeveler {
  constructor(baseStats) {
    this.stats = { ...baseStats }
  }

  clone() {
    return new FairyLeveler({ ...this.stats })
  }

  levelUpTimes(levelIncrement, level) {
    const clone = this.clone()
    for (const key in clone.stats) {
      clone.stats[key] *= levelIncrement
      clone.stats[key] = +clone.stats[key]?.toFixed(3)
    }

    if (level >= 0) {
      clone.stats['level'] = level
    }
    return clone
  }

  add(other) {
    const clone = this.clone()
    for (const key in clone.stats) {
      clone.stats[key] += other[key]
    }
    return clone
  }
}

const tiersScale = {
  0: 1,
  1: 1.2,
  2: 1.4,
}

const BASE_ITERATIONS = 10
const calcStatGrowth = (maxStat, tier, maxLevel = 50) => {
  const tierScaler = tiersScale[tier]
  const iterations = BASE_ITERATIONS + maxLevel
  const baseGrowthPerLevel = +(maxStat / tierScaler / iterations).toFixed(3)
  return baseGrowthPerLevel
}
calcStatGrowth(200, 2)

const fairiesList = [
  {
    name: 'yethog',
    tier: 0,
    baseStatsIncrease: {
      hp: calcStatGrowth(200, 0),
      power: calcStatGrowth(0.25, 0),
      defense: calcStatGrowth(8, 0),
      speed: calcStatGrowth(7, 0),
      special: calcStatGrowth(0.85, 0),
    },
  },
  {
    name: 'yetopa',
    tier: 1,
    baseStatsIncrease: {
      hp: calcStatGrowth(280, 1),
      power: calcStatGrowth(0.5, 1),
      defense: calcStatGrowth(20, 1),
      speed: calcStatGrowth(0.25, 1),
      special: calcStatGrowth(0.5, 1),
    },
  },
  {
    name: 'Harpire',
    tier: 0,
    baseStatsIncrease: {
      hp: calcStatGrowth(180, 0),
      power: calcStatGrowth(0.35, 0),
      defense: calcStatGrowth(8, 0),
      speed: calcStatGrowth(1, 0),
      special: calcStatGrowth(0.75, 0),
    },
  },
  {
    name: 'Dragoire',
    tier: 2,
    baseStatsIncrease: {
      hp: calcStatGrowth(340, 2),
      power: calcStatGrowth(1, 2),
      defense: calcStatGrowth(24, 2),
      speed: calcStatGrowth(0.25, 2),
      special: calcStatGrowth(0.5, 2),
    },
  },
  {
    name: 'Nightsing',
    tier: 2,
    baseStatsIncrease: {
      hp: calcStatGrowth(220, 2),
      power: calcStatGrowth(0.85, 2),
      defense: calcStatGrowth(2, 2),
      speed: calcStatGrowth(1, 2),
      special: calcStatGrowth(1.25, 2),
    },
  },
  // { name: 'homemaker', tier: 0, baseStatsIncrease: { hp: 1, power: 0.01, defense: 0.1, speed: 0.01, special: 0.01 } },
  // { name: 'eclipse', tier: 2, baseStatsIncrease: { hp: 1.5, power: 0.035, defense: 0.1, speed: 0.03, special: 0.02 } },
  // {
  //   name: 'psi-nightmare',
  //   tier: 2,
  //   baseStatsIncrease: { hp: 1.2, power: 0.025, defense: 0.15, speed: 0.025, special: 0.03 },
  // },
]
const levels = [1, 10, 20, 30, 40, 50]
const baseLevels = 10

fairiesList.forEach(fairy => {
  const baseInstance = new FairyLeveler(fairy.baseStatsIncrease)
  console.log(`\n\n--- ${fairy.name} ---`)
  let fairyStats = []
  levels.forEach(level => {
    const levelIncrements = level === 1 ? level + baseLevels - 1 : level + baseLevels
    const fairyTierScale = tiersScale[fairy.tier]

    const leveledInstance = baseInstance.levelUpTimes(levelIncrements * fairyTierScale, level)
    leveledInstance.stats.hp = Math.round(leveledInstance.stats.hp)
    fairyStats = [...(fairyStats || []), leveledInstance.stats]
    // console.log(`level ${level}: `, leveledInstance.stats)
    // console.log('fairy.baseStatsIncrease: ', , leveledInstance.stats)
  })
  fairyStats = [{ ...fairy.baseStatsIncrease, level: 'growth' }, ...(fairyStats || [])]
  console.table(fairyStats)
})
