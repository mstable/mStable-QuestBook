import { SubgraphDataSource } from './SubgraphDataSource'

export class PolygonProtocolSubgraphDataSource extends SubgraphDataSource {
  static create() {
    return new PolygonProtocolSubgraphDataSource('/subgraphs/name/mstable/mstable-protocol-polygon')
  }

  async didMintMusd(account: string) {
    const result = await this.query<{ mintMultiTransactions: { id: string }[]; mintSingleTransactions: { id: string }[] }>(
      `{
        mintMultiTransactions(where:{sender:"${account}"}) {
          id
        }
        mintSingleTransactions(where:{sender:"${account}"}) {
          id
        }
      }`,
    )

    const { mintMultiTransactions = [], mintSingleTransactions = [] } = result.body.data
    return mintMultiTransactions.length > 0 || mintSingleTransactions.length > 0
  }
}
