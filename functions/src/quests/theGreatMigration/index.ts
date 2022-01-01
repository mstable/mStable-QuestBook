import { logger } from 'firebase-functions'
import { formatUnits } from 'ethers/lib/utils'
import { QuestObjective, QuestDefinition } from '../types'

const objectives: QuestObjective[] = [
  {
    id: 'stakerInV1BeforeCutoff',
    title: 'Staked in V1',
    description: 'You were staked in V1 before the cutoff date',
    points: 50,
    async checker(account, delegates, dataSources) {
      const complete = await dataSources.legacyGovSubgraph.wasStakedInV1(account)
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
    async checker(account, delegates, dataSources) {
      const wasStakedInV1 = await dataSources.legacyGovSubgraph.wasStakedInV1(account)
      const mostRecentStakeAmount = await dataSources.legacyGovSubgraph.mostRecentStakeAmount(account)

      if (!wasStakedInV1 || mostRecentStakeAmount <= 0) {
        return {
          complete: false,
          progress: 0,
        }
      }

      const [amountStakedMTAV2Raw] = await dataSources.stakedTokenMTA.contract.rawBalanceOf(account)
      const [amountStakedBPTRaw] = await dataSources.stakedTokenBPT.contract.rawBalanceOf(account)

      const priceCoefficient = await dataSources.stakedTokenBPT.contract.priceCoefficient()
      const amountStakedBPTInMTATermsBN = amountStakedBPTRaw.mul(priceCoefficient).div(10000)

      const amountStakedBPTInMTATermsSimple = parseFloat(formatUnits(amountStakedBPTInMTATermsBN))
      const amountStakedMTAV2Simple = parseFloat(formatUnits(amountStakedMTAV2Raw))
      const totalAmountStakedInMTATerms = amountStakedMTAV2Simple + amountStakedBPTInMTATermsSimple

      if (totalAmountStakedInMTATerms <= 0) {
        return {
          complete: false,
          progress: 0,
        }
      }

      const threshold = mostRecentStakeAmount * 0.9
      const progress = Math.max(Math.min(totalAmountStakedInMTATerms / threshold, 1), 0)
      const complete = progress >= 1

      logger.debug(
        JSON.stringify({
          account,
          amountStakedBPTInMTATermsSimple,
          amountStakedMTAV2Simple,
          totalAmountStakedInMTATerms,
          threshold,
          progress,
          complete,
        }),
      )

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
