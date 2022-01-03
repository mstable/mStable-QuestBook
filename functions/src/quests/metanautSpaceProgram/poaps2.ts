import { QuestObjective } from '../types'

export const poaps2: QuestObjective = {
  id: 'poaps2',
  title: 'POAP community call collection',
  description: 'You claimed a POAP for at least three recent community calls',
  points: 10,
  async checker(account, delegates, dataSources) {
    const eventIds = [10142, 10774, 11177, 11291, 11709, 12805, 14894, 16176, 3560, 4742, 6279, 7380, 9057, 9144]
    const owned = await dataSources.poaps.poapCount(account, eventIds)

    const threshold = 3
    const complete = owned >= threshold
    const progress = Math.min(1, owned / threshold)

    return {
      complete,
      progress,
    }
  },
}
