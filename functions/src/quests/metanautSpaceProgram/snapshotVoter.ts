import { QuestObjective } from '../types'

export const aDecentProposal: QuestObjective = {
  id: 'aDecentProposal',
  title: 'A Decent Proposal',
  description: 'Proposed a Snapshot vote and received x votes',
  points: 25,
  async checker(account, delegates, dataSources) {
    const complete = await dataSources.snapshot.didVote(account)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
