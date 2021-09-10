import { QuestObjective, QuestDefinition } from '../types'
import { formatUnits } from 'ethers/lib/utils'

const objectives: QuestObjective[] = [
  {
    id: 'stakerInV1BeforeCutoff',
    title: 'Staked in V1',
    description: 'You were staked in V1 before the cutoff date',
    points: 50,
    async checker(account, dataSources) {
      const complete = await dataSources.legacyGovSubgraph.didStakeBeforeCutoff(account, 1623080555)
      return {
        complete,
        progress: complete ? 1 : 0,
      }
    },
  },
  {
    id: 'migratedToV2',
    title: 'Migrate to V2',
    description: 'Migrate 80% of your previous staked balance to Staking V2 before the cutoff date',
    points: 50,
    async checker(account, dataSources) {
      const amountStakedV1 = await dataSources.legacyGovSubgraph.stakedAmountBeforeCutoff(account, 1623990000)

      if (amountStakedV1 <= 0) {
        return {
          complete: false,
          progress: 0,
        }
      }

      const amountStakedV2BN = await dataSources.stakedToken.contract.balanceOf(account)
      const amountStakedV2 = parseFloat(formatUnits(amountStakedV2BN))

      if (amountStakedV2 <= 0) {
        return {
          complete: false,
          progress: 0,
        }
      }

      const threshold = amountStakedV1 * 0.8
      const progress = Math.max(amountStakedV2 / threshold, 1)
      const complete = amountStakedV2 >= threshold

      return {
        complete,
        progress,
      }
    },
  },
]

export const theGreatMigration: QuestDefinition = {
  id: 'theGreatMigration',
  ethereumId: 0,
  objectives,
  requiredPoints: 100,
  title: 'The Great Migration',
  description: 'Migrate from Staking V1',
}
