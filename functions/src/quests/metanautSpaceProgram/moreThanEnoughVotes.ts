import { QuestObjective } from '../types'

export const moreThanEnoughVotes: QuestObjective = {
  id: 'moreThanEnoughVotes',
  title: 'Even More Snapshot participation!',
  description: 'When a proposal gets at least 100 votes, everyone wins',
  points: 25,
  async checker(account, delegates, dataSources) {
    const votes = await dataSources.snapshot.getHighestVotesForRecentProposals()

    if (votes === 0) {
      return {
        complete: false,
        progress: 0,
      }
    }

    const threshold = 100
    const complete = votes >= threshold
    const progress = Math.min(1, votes / threshold)
    return {
      complete,
      progress,
    }
  },
}
