import { QuestObjective } from '../types'

export const selfless: QuestObjective = {
  id: 'selfless',
  title: 'Selfless',
  description: "As a staker, give no weight to staking rewards. You know what you're doing.",
  points: 5,
  async checker(account, dataSources) {
    const [stkMta, stkBPT] = await dataSources.emissionsController.contract.getVoterPreferences(account)
    const stakingWeight = stkBPT.weight.add(stkMta.weight)
    const complete = stakingWeight.eq(50)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
