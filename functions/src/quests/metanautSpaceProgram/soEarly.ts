import { QuestObjective } from '../types'

export const soEarly: QuestObjective = {
  id: 'soEarly',
  title: 'So early it hurts',
  description: "Got a tx in before 09/2020. Credit where it's due.",
  points: 25,
  async checker(account, delegates, dataSources) {
    const timestamp = await dataSources.mainnetProtocolSubgraph.getEarliestTx(account)
    if (!timestamp) {
      return {
        complete: false,
        progress: 0,
      }
    }

    const complete = timestamp < 1598911200
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
