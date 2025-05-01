export interface Fairy {
  name: string
  id: string
  modelPath: string
  description: string
  element: string
  tier: number
  level: number
  xp: number
  nextLevelXp: number
  statGrowthPerLevel: object
  evolutionsList: any[]
  statsGrowthSteps: {
    hp: number
    power: number
    defense: number
    speed: number
    special: number
  }
  stats: {
    name: string
    hp: number
    previousHp: number
    maxHp: number
    damage: number
    defense: number
    speed: number
    special: number
  }
  currentSpell?: any
  spells?: any[]
  passiveSpells?: any[]
}
