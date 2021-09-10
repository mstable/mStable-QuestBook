import { QuestObjective, QuestDefinition } from '../types'

const objectives: QuestObjective[] = [
  {
    id: 'whale1',
    title: '100k MTA staked',
    description: 'Staked 100k MTA for > 12 months',
    points: 100,
    async checker() {
      // TODO use dataSources
      const complete = false
      const progress = 0
      return {
        complete,
        progress,
      }
    },
  },
]

export const whale: QuestDefinition = {
  id: 'whale',
  ethereumId: 2,
  objectives,
  requiredPoints: 100,
  title: 'Super-ultra-hyper-mega-Meta-whale',
  description: 'STACKS UPON STACKS UPON STACKS',
}
