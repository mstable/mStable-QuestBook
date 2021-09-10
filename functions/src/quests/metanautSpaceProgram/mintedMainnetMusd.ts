import { QuestObjective } from '../types'

export const mintedMainnetMusd: QuestObjective = {
  id: 'mintedMainnetMusd',
  title: 'Minted Mainnet mUSD',
  description: 'We like the stablecoins.',
  points: 4,
  async checker(account, dataSources) {
    const complete = await dataSources.mainnetProtocolSubgraph.didMintMusd(account)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
