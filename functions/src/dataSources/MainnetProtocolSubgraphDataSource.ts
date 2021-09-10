import { SubgraphDataSource } from './SubgraphDataSource'

export class MainnetProtocolSubgraphDataSource extends SubgraphDataSource {
  static create() {
    return new MainnetProtocolSubgraphDataSource('/subgraphs/name/mstable/mstable-protocol')
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
