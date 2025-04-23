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
const fairiesList = [
  { name: 'yethog', tier: 0, baseStatsIncrease: { hp: 4, attack: 0.05, defence: 0.4, speed: 0.02, special: 0.02 } },
  {
    name: 'yethog alt',
    tier: 1,
    baseStatsIncrease: { hp: 2, attack: 0.025, defence: 0.2, speed: 0.015, special: 0.02 },
  },
  { name: 'homemaker', tier: 0, baseStatsIncrease: { hp: 1, attack: 0.01, defence: 0.1, speed: 0.01, special: 0.01 } },
  { name: 'eclipse', tier: 2, baseStatsIncrease: { hp: 1.5, attack: 0.035, defence: 0.1, speed: 0.03, special: 0.02 } },
  {
    name: 'nightmare',
    tier: 2,
    baseStatsIncrease: { hp: 1.2, attack: 0.025, defence: 0.15, speed: 0.025, special: 0.03 },
  },
]
const levels = [1, 10, 20, 30, 40]
const baseLevels = 5

fairiesList.forEach(fairy => {
  const base_instance = new FairyLeveler(fairy.baseStatsIncrease)
  console.log(`\n\n--- ${fairy.name} ---`)
  let fairyStats = []
  levels.forEach(level => {
    const levelIncrements = level === 1 ? level + baseLevels - 1 : level + baseLevels
    const fairyTierScale = tiersScale[fairy.tier]

    const leveledInstance = base_instance.levelUpTimes(levelIncrements * fairyTierScale, level)
    fairyStats = [...(fairyStats || []), leveledInstance.stats]
    // console.log(`level ${level}: `, leveledInstance.stats)
  })
  console.table(fairyStats)
})
