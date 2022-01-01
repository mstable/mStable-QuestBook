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
    return `
        {
          tokens(where:{event:"${eventId}", owner: "${account}") { id }
        }
      `
  }

  private static hasPoapsQuery(account: string, eventIds: number[]) {
    return `
        {
          tokens(where:{event_in:"${eventIds.join(',')}", owner: "${account}") { id }
        }
      `
  }

  async hasPoap(account: string, eventId: number, network: 'gnosis' | 'mainnet') {
    const dataSource = this[network]
    const result = await dataSource.query<{ tokens?: { id: string }[] }>(PoapDataSource.hasPoapQuery(account, eventId))
    return !!result.body.data.tokens?.[0]?.id
  }

  async poapCount(account: string, eventIds: number[], network: 'gnosis' | 'mainnet') {
    const dataSource = this[network]
    const result = await dataSource.query<{ tokens?: { id: string }[] }>(PoapDataSource.hasPoapsQuery(account, eventIds))
    return (result.body.data.tokens ?? []).length
  }
}
