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

  async didDepositInSave(account: string) {
    const result = await this.query<{
      savingsContractDepositTransactions: { id: string }[]
      boostedSavingsVaultStakeTransactions: { id: string }[]
    }>(
      `{
        savingsContractDepositTransactions(where:{sender:"${account}"}) {
          id
        }
        boostedSavingsVaultStakeTransactions(where:{sender:"${account}"}) {
          id
        }
      }`,
    )

    const { savingsContractDepositTransactions = [], boostedSavingsVaultStakeTransactions = [] } = result.body.data
    return savingsContractDepositTransactions.length > 0 || boostedSavingsVaultStakeTransactions.length > 0
  }

  async getEarliestTx(account: string) {
    const result = await this.query<{
      transactions: { id: string; timestamp: string }[]
    }>(
      `{
        transactions(first: 1, where:{sender:"${account}"}, orderBy:timestamp, orderDirection: asc) {
          id
          timestamp
        }
      }`,
    )

    const { transactions = [] } = result.body.data
    return transactions[0]?.timestamp ? parseInt(transactions[0]?.timestamp) : undefined
  }
}
