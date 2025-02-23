import { DEFAULT_CHARGE_DURATION } from '@/enums/constants.ts'

export const getChargeDuration = (entity: any) => {
  return DEFAULT_CHARGE_DURATION / entity.currentSpell.speed
}
