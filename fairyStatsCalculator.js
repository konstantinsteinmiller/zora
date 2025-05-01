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

// const tiersScale = {
//   0: 1,
//   1: 1.2,
//   2: 1.4,
// }
const tiersScale = {
  0: 1,
  1: 1.1,
  2: 1.2,
}

const BASE_ITERATIONS = 10

const BASE_INCREASE_STEP = 0.15
const BASE_INCREASE_HP_STEP = 40
const BASE_INCREASE_DEF_STEP = 3

const getStatGrowth = ({ hp, power, defense, speed, special }, tier, maxLevel = 50) => {
  const maxHp = 150 + hp * BASE_INCREASE_HP_STEP
  const maxPower = 0.6 + power * BASE_INCREASE_STEP
  const maxDef = 10 + defense * BASE_INCREASE_DEF_STEP
  const maxSpeed = 0.6 + speed * BASE_INCREASE_STEP
  const maxSpecial = 0.6 + special * BASE_INCREASE_STEP
  return {
    hp: calcStatGrowth(maxHp, tier, maxLevel),
    power: calcStatGrowth(maxPower, tier, maxLevel),
    defense: calcStatGrowth(maxDef, tier, maxLevel),
    speed: calcStatGrowth(maxSpeed, tier, maxLevel),
    special: calcStatGrowth(maxSpecial, tier, maxLevel),
  }
}

const calcStatGrowth = (maxStat, tier, maxLevel = 50) => {
  // const tierScaler = tiersScale[tier]
  const iterations = BASE_ITERATIONS + maxLevel
  const baseGrowthPerLevel = +(maxStat / iterations).toFixed(3)
  return baseGrowthPerLevel
}
// calcStatGrowth(200, 2)

const fairiesList = [
  {
    name: 'yethog',
    tier: 0,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 2,
        power: -1,
        defense: 1,
        speed: -1,
        special: 0,
      },
      0
    ),
  },
  {
    name: 'yetopa',
    tier: 1,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 3,
        power: 0,
        defense: 3,
        speed: -3,
        special: -1,
      },
      1
    ),
  },
  {
    name: 'Harpire',
    tier: 0,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 0,
        power: 1,
        defense: -1,
        speed: 1,
        special: 0,
      },
      0
    ),
  },
  {
    name: 'Dragir',
    tier: 0,
    baseStatsIncrease: getStatGrowth(
      {
        hp: -1,
        power: 2,
        defense: 0,
        speed: -1,
        special: 1,
      },
      0
    ),
  },
  {
    name: 'Dragorin',
    tier: 1,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 2,
        power: 2,
        defense: 2,
        speed: -3,
        special: -1,
      },
      1
    ),
  },
  {
    name: 'Dragoire',
    tier: 2,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 4,
        power: 2,
        defense: 2,
        speed: -3,
        special: -2,
      },
      2
    ),
  },
  {
    name: 'Nightsing',
    tier: 2,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 0,
        power: 2,
        defense: -2,
        speed: 2,
        special: 1,
      },
      2
    ),
  },
  {
    name: 'Dandalina',
    tier: 1,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 0,
        power: 0,
        defense: -2,
        speed: 3,
        special: 1,
      },
      1
    ),
  },
  {
    name: 'Thunlady',
    tier: 2,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 1,
        power: 2,
        defense: -1,
        speed: -1,
        special: 1,
      },
      2
    ),
  },
  {
    name: 'Mushyu',
    tier: 0,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 0,
        power: -1,
        defense: 0,
        speed: -1,
        special: 3,
      },
      0
    ),
  },
  {
    name: 'Mushiddle',
    tier: 1,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 2,
        power: -1,
        defense: 1,
        speed: -1,
        special: 1,
      },
      1
    ),
  },
  {
    name: 'Household',
    tier: 0,
    baseStatsIncrease: getStatGrowth(
      {
        hp: 1,
        power: 0,
        defense: 0,
        speed: 0,
        special: 0,
      },
      0
    ),
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
