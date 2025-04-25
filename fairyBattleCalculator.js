class FairyDummy {
  constructor(params) {
    Object.assign(this, params)
    this.maxHp = params.hp
    this.chargeLevel = 0
  }

  heal() {
    this.hp = this.maxHp
    this.chargeLevel = 0
  }

  attack(other) {
    const damage = +(this.damage * this.chargeLevel).toFixed(2)
    console.log('this.damage: ', damage, +this.chargeLevel.toFixed(2))
    other.hp -= Math.max(damage - other.def, 0)
    this.chargeLevel = 0
  }

  toString() {
    return this.name
  }
}

function fightStep(fairy, other, n) {
  if (Math.random() > 0.95 || fairy.chargeLevel > 0.9) {
    if (fairy.chargeLevel >= 0.5) {
      fairy.attack(other)
      return
    }
  }
  fairy.chargeLevel += 0.005 * fairy.speed
}

function fightLoop(fairy, other, n) {
  fairy.heal()
  other.heal()
  while (fairy.hp > 0 && other.hp > 0) {
    fightStep(fairy, other, n)
    fightStep(other, fairy, n)
  }

  if (fairy.hp > 0) {
    return 1
  }
  if (other.hp > 0) {
    return -1
  }
  return 0
}

function multipleBattles(fairy, other, times) {
  let fairyWon = 0
  let enemyWon = 0
  for (let n = 0; n < times; n++) {
    const result = fightLoop(fairy, other, n * times)
    if (result === 1) {
      fairyWon++
    } else if (result === -1) {
      enemyWon++
    }
    n++
  }

  console.log(`fairyWon=${fairyWon}, enemyWon=${enemyWon}`)
}

const alice = new FairyDummy({
  name: 'alice',
  hp: 40,
  damage: 8,
  speed: 1,
  def: 3.25,
})
const eve = new FairyDummy({
  name: 'eve',
  hp: 49,
  damage: 12,
  speed: 1,
  def: 0,
})

multipleBattles(alice, eve, 10000)
