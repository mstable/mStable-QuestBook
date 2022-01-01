import { QuestObjective } from '../types'

export const gmBossDefeated: QuestObjective = {
  id: 'gmBossDefeated',
  title: 'The Chicken of Destiny',
  description: 'gm Boss defeated (#gm on the mStable Discord)',
  points: 10,
  async checker(account, delegates, dataSources) {
    let complete = false

    for (const [network, eventId] of Object.entries({
      gnosis: 8735,
    })) {
      complete = await dataSources.poaps.hasPoap(account, eventId, network as 'gnosis' | 'mainnet')
      if (complete) break
    }

    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
