import { QuestObjective } from '../types'

export const saved: QuestObjective = {
  id: 'saved',
  title: 'Saved',
  description: 'Deposit any amount in Save/Save Vault.',
  points: 5,
  async checker(account, delegates, dataSources) {
    const complete = await dataSources.mainnetProtocolSubgraph.didDepositInSave(account)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
