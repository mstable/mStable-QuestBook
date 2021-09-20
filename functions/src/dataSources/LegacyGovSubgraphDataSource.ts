import { SubgraphDataSource } from './SubgraphDataSource'

export class LegacyGovSubgraphDataSource extends SubgraphDataSource {
  static create() {
    return new LegacyGovSubgraphDataSource('/subgraphs/name/mstable/mstable-governance')
  }

  async didStakeBeforeCutoff(account: string) {
    const cutoffTimestamp = 1623080555 // Mon Jun 07 2021 15:42:35 GMT+0000
    const blockAtCutoff = 12588271
    const result = await this.query<{ userLockups: { id: string }[] }>(
      `query {
          userLockups(where: { account: "${account}", ejected: false, ts_lt: ${cutoffTimestamp} }, block: { number: ${blockAtCutoff} }) {
              id
          }
      }`,
    )
    return !!result.body.data.userLockups[0]?.id
  }

  async stakedAmountBeforeCutoff(account: string): Promise<number> {
    const cutoffTimestamp = 1623080555 // Mon Jun 07 2021 15:42:35 GMT+0000
    const blockAtCutoff = 12588271
    const result = await this.query<{ userLockups: { id: string; value: string }[] }>(
      `query {
          userLockups(where: { account: "${account}", ts_lt: ${cutoffTimestamp}}, block: { number: ${blockAtCutoff} }) {
              id
              value
          }
      }`,
    )

    const { userLockups } = result.body.data

    if (!userLockups[0]?.id) {
      return 0
    }

    return parseInt(userLockups[0]?.value ?? '0') / 1e18
  }
}
