import { SubgraphDataSource } from './SubgraphDataSource'

export class LegacyGovSubgraphDataSource extends SubgraphDataSource {
  static create() {
    return new LegacyGovSubgraphDataSource('/subgraphs/name/mstable/mstable-governance')
  }

  async didStakeBeforeCutoff(account: string, cutoffTimestamp: number) {
    const result = await this.query<{ userLockups: { id: string }[] }>(
      `query {
          userLockups(where: { account: "${account}", ts_lt: ${cutoffTimestamp}}) {
              id
          }
      }`,
    )
    return !!result.body.data.userLockups[0]?.id
  }

  async stakedAmountBeforeCutoff(account: string, cutoffTimestamp: number): Promise<number> {
    const result = await this.query<{ userLockups: { id: string }[]; stakingBalances: { amount: string }[] }>(
      `query {
          userLockups(where: { account: "${account}", ts_lt: ${cutoffTimestamp}}) {
              id
          }
          stakingBalances(where: { account: "${account}" }) {
              amount
          }
      }`,
    )

    const { stakingBalances, userLockups } = result.body.data

    if (!userLockups[0]?.id) {
      return 0
    }

    return parseInt(stakingBalances[0]?.amount ?? '0') / 1e18
  }
}
