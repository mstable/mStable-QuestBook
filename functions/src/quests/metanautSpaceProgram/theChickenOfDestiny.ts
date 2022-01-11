import { QuestObjective } from '../types'

export const theChickenOfDestiny: QuestObjective = {
  id: 'theChickenOfDestiny',
  title: 'The Chicken of Destiny',
  description: 'You say gm, and have at the POAPs to prove it.',
  points: 10,
  async checker(account, delegates, dataSources) {
    const eventIds = [10158, 9288, 8735]
    const owned = await dataSources.poaps.poapCount(account, eventIds)

    const threshold = 1
    const complete = owned >= threshold
    const progress = Math.min(1, owned / threshold)

    return {
      complete,
      progress,
    }
  },
}
