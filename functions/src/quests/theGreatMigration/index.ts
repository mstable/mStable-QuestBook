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
    description: 'Migrate 90% of your previous staked balance to Staking V2 before the cutoff date',
    points: 50,
    async checker(account, dataSources) {
      const amountStakedV1 = await dataSources.legacyGovSubgraph.stakedAmountBeforeCutoff(account, 1634367339)

      if (amountStakedV1 <= 0) {
        return {
          complete: false,
          progress: 0,
        }
      }

      const amountStakedMTAV2BN = await dataSources.stakedTokenMTA.contract.balanceOf(account)
      const amountStakedMTAV2 = parseFloat(formatUnits(amountStakedMTAV2BN))

      const [amountStakedBPTRaw] = await dataSources.stakedTokenBPT.contract.rawBalanceOf(account)
      const priceCoefficient = await dataSources.stakedTokenBPT.contract.priceCoefficient()
      const amountStakedBPTInMTATermsBN = amountStakedBPTRaw.mul(priceCoefficient).div(10000)
      const amountStakedBPTInMTATerms = parseFloat(formatUnits(amountStakedBPTInMTATermsBN))

      const totalAmountStakedInMTATerms = amountStakedMTAV2 + amountStakedBPTInMTATerms

      if (totalAmountStakedInMTATerms <= 0) {
        return {
          complete: false,
          progress: 0,
        }
      }

      const threshold = amountStakedV1 * 0.9
      const progress = Math.max(totalAmountStakedInMTATerms / threshold, 1)
      const complete = totalAmountStakedInMTATerms >= threshold

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
