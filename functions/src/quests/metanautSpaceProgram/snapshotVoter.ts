import { QuestObjective } from '../types'

export const snapshotVoter: QuestObjective = {
  id: 'snapshotVoter',
  title: 'Snapshot Voter',
  description: 'Voted on a mstablegovernancedao.eth vote',
  points: 25,
  async checker(account, delegates, dataSources) {
    const complete = await dataSources.snapshot.didVote(account)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
