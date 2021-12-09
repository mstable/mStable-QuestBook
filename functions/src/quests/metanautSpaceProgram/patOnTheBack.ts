import { QuestObjective } from '../types'

export const patOnTheBack: QuestObjective = {
  id: 'patOnTheBack',
  title: 'Pat on the back',
  description: "As a staker, voted with over 50% of your vote on staking rewards. After all, why not? Why shouldn't I keep it?",
  points: 2,
  async checker(account, dataSources) {
    const [stkMta, stkBPT] = await dataSources.emissionsController.contract.getVoterPreferences(account)
    const stakingWeight = stkBPT.weight.add(stkMta.weight)
    const complete = stakingWeight.gte(50)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
