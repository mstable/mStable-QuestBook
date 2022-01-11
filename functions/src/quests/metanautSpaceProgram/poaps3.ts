import { QuestObjective } from '../types'

export const poaps3: QuestObjective = {
  id: 'poaps3',
  title: 'POAP grab bag collection',
  description: 'You claimed two POAPs for other mStable events',
  points: 10,
  async checker(account, delegates, dataSources) {
    const eventIds = [11178, 9640, 6286, 4349, 14000, 13999]
    const owned = await dataSources.poaps.poapCount(account, eventIds)

    const threshold = 2
    const complete = owned >= threshold
    const progress = Math.min(1, owned / threshold)

    return {
      complete,
      progress,
    }
  },
}
