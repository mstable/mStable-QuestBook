import { QuestObjective } from '../types'

export const mintedPolygonMusd: QuestObjective = {
  id: 'mintedPolygonMusd',
  title: 'Minted Polygon mUSD',
  description: 'We like the stablecoins.',
  points: 1,
  async checker(account, dataSources) {
    const complete = await dataSources.polygonProtocolSubgraph.didMintMusd(account)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
