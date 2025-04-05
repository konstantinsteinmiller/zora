import NPCController from '@/entity/NPCController.ts'
import type { Guild } from '@/types/entity.ts'

export default (config: any = {}) => {
  const name = config.model.split('.')[0]
  return NPCController({
    modelHeight: 1.8,
    modelPath: `/models/${name}/${config.model}`,
    guild: 'GLD_NONE' as Guild,
    ...config,
  })
}
