import { QuestObjective } from '../types'

export const patOnTheBack: QuestObjective = {
  id: 'patOnTheBack',
  title: 'Pat on the back',
  description: "As a staker, voted with over 50% of your vote on staking rewards. After all, why not? Why shouldn't I keep it?",
  points: 5,
  async checker(account, delegates, dataSources) {
    let complete = false
    let progress = 0

    for (const userId of delegates) {
      const [stkMta, stkBPT] = await dataSources.emissionsController.contract.getVoterPreferences(userId)
      const stakingWeight = stkBPT.weight.add(stkMta.weight)

      complete = stakingWeight.gte(50)
      progress = complete ? 1 : 0

      if (complete) break
    }

    return {
      complete,
      progress,
    }
  },
}
