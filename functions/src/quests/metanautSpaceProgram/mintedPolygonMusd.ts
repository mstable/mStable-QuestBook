import { QuestObjective } from '../types'
import { saverPolygon } from './saverPolygon'

export const mintedPolygonMusd: QuestObjective = {
  id: 'mintedPolygonMusd',
  title: 'Minted Polygon mUSD',
  description: 'We like the stablecoins (on Polygon).',
  points: 10,
  async checker(account, delegates, dataSources) {
    const saverObjective = await saverPolygon.checker(account, delegates, dataSources)

    // If the user made any progress on the saver objective, it means they minted mUSD.
    // This is useful because wrapper contracts won't link a mint to the user's account.
    if (saverObjective.progress && saverObjective.progress > 0) {
      return {
        complete: true,
        progress: 1,
      }
    }

    const complete = await dataSources.polygonProtocolSubgraph.didMintMusd(account)
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
