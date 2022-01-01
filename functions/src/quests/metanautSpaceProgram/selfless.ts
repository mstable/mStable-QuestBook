import { QuestObjective } from '../types'

export const selfless: QuestObjective = {
  id: 'selfless',
  title: 'Selfless',
  description: "As a staker, give no weight to staking rewards. You know what you're doing.",
  points: 5,
  async checker(account, delegates, dataSources) {
    let complete = false
    let progress = 0

    for (const userId of delegates) {
      const [stkMta, stkBPT] = await dataSources.emissionsController.contract.getVoterPreferences(userId)
      const stakingWeight = stkBPT.weight.add(stkMta.weight)
      complete = stakingWeight.eq(50)

      progress = complete ? 1 : 0

      if (complete) break
    }

    return {
      complete,
      progress,
    }
  },
}
