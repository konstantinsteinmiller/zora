import { DEFAULT_CHARGE_DURATION } from '@/utils/constants.ts'

export const getChargeDuration = (entity: any) => {
  return DEFAULT_CHARGE_DURATION / entity.currentSpell.speed
}
