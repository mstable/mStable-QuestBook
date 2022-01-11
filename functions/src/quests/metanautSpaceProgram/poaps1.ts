import { QuestObjective } from '../types'

export const poaps1: QuestObjective = {
  id: 'poaps1',
  title: 'POAP launch party collection',
  description: 'You claimed a POAP for at least one recent launch event',
  points: 10,
  async checker(account, delegates, dataSources) {
    const eventIds = [17436, 7786, 7785]
    const owned = await dataSources.poaps.poapCount(account, eventIds)

    const complete = owned >= 1
    const progress = complete ? 1 : 0

    return {
      complete,
      progress,
    }
  },
}
