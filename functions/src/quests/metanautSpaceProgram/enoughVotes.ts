import { QuestObjective } from '../types'

export const enoughVotes: QuestObjective = {
  id: 'enoughVotes',
  title: 'More Snapshot participation!',
  description: 'When a proposal gets at least 50 votes, everyone wins',
  points: 10,
  async checker(account, delegates, dataSources) {
    const votes = await dataSources.snapshot.getHighestVotesForRecentProposals()

    if (votes === 0) {
      return {
        complete: false,
        progress: 0,
      }
    }

    const threshold = 50
    const complete = votes >= threshold
    const progress = Math.min(1, votes / threshold)
    return {
      complete,
      progress,
    }
  },
}
