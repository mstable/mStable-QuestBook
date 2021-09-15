import { BigNumber } from 'ethers'

import { QuestObjective, QuestDefinition } from '../types'

const objectives: QuestObjective[] = [
  {
    id: 'whale1',
    title: '1 million MTA staked',
    description: 'Staked 1M MTA for > 12 months',
    points: 100,
    async checker(account, dataSources) {
      const balanceData = await dataSources.stakedToken.contract.balanceData(account)
      const oneMil = BigNumber.from((1e18).toString()).pow(7)
      const hodledAmount = balanceData.raw.gte(oneMil)
      const hodledTime = balanceData.timeMultiplier >= 40
      const complete = hodledAmount && hodledTime
      const progress = complete ? 1 : 0
      return {
        complete,
        progress,
      }
    },
  },
]

export const whale: QuestDefinition = {
  id: 'whale',
  ethereumId: 3,
  objectives,
  requiredPoints: 100,
  title: 'Super-ultra-hyper-mega-Meta-whale',
  description: 'STACKS UPON STACKS UPON STACKS',
}
