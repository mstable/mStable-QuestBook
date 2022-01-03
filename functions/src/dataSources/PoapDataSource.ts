import { SubgraphDataSource } from './SubgraphDataSource'

export class PoapDataSource {
  static create() {
    return new PoapDataSource({ gnosis: '/subgraphs/name/poap-xyz/poap-xdai', mainnet: '/subgraphs/name/poap-xyz/poap' })
  }

  gnosis: SubgraphDataSource
  mainnet: SubgraphDataSource

  constructor({ gnosis, mainnet }: { gnosis: string; mainnet: string }) {
    this.mainnet = new SubgraphDataSource(mainnet)
    this.gnosis = new SubgraphDataSource(gnosis)
  }
  private static hasPoapQuery(account: string, eventId: number) {
    return `{ tokens(where:{event:"${eventId}", owner: "${account}" }) { id } }`
  }

  private static hasPoapsQuery(account: string, eventIds: number[]) {
    return `{ tokens(where:{event_in:[${eventIds.map((id) => `"${id}"`).join(',')}], owner: "${account}" }) { id } }`
  }

  async multiQuery<T>(query: string) {
    return Promise.all([this.gnosis, this.mainnet].map((dataSource) => dataSource.query<T>(query)))
  }

  async hasPoap(account: string, eventId: number) {
    const responses = await this.multiQuery<{ tokens?: { id: string }[] }>(PoapDataSource.hasPoapQuery(account, eventId))
    return responses.some((resp) => !!resp.body.data.tokens?.[0]?.id)
  }

  async poapCount(account: string, eventIds: number[]) {
    const responses = await this.multiQuery<{ tokens?: { id: string }[] }>(PoapDataSource.hasPoapsQuery(account, eventIds))
    return responses.reduce((prev, resp) => prev + (resp.body.data.tokens?.length ?? 0), 0)
  }
}
