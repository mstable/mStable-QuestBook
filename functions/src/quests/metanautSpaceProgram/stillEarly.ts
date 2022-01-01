import { QuestObjective } from '../types'

export const stillEarly: QuestObjective = {
  id: 'stillEarly',
  title: 'Still early',
  description: 'Got a tx in before 2021. Nicely done!',
  points: 25,
  async checker(account, delegates, dataSources) {
    const timestamp = await dataSources.mainnetProtocolSubgraph.getEarliestTx(account)
    if (!timestamp) {
      return {
        complete: false,
        progress: 0,
      }
    }

    const complete = timestamp < 1609455599
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
