import { QuestObjective } from '../types'

export const poaps: QuestObjective = {
  id: 'poaps',
  title: 'Have you seen my POAP collection?',
  description: 'Obtain 10 mStable POAPs for *33* QP',
  points: 33,
  async checker(account, delegates, dataSources) {
    let complete = false
    let progress = 0

    let owned = 0
    for (const [network, eventIds] of Object.entries({
      gnosis: [8735],
    })) {
      const count = await dataSources.poaps.poapCount(account, eventIds, network as 'gnosis' | 'mainnet')
      owned += count

      complete = owned >= 10
      progress = Math.min(1, owned / 10)

      if (complete) break
    }

    return {
      complete,
      progress,
    }
  },
}
