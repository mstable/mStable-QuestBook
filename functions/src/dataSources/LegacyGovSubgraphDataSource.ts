import { SubgraphDataSource } from './SubgraphDataSource'

export class LegacyGovSubgraphDataSource extends SubgraphDataSource {
  static create() {
    return new LegacyGovSubgraphDataSource('/subgraphs/name/mstable/mstable-governance')
  }

  async wasStakedInV1(account: string) {
    const result = await this.query<{ userLockups: { id: string }[] }>(
      `query {
          userLockups(where: { account: "${account}" }) {
              id
          }
      }`,
    )
    return !!result.body.data.userLockups[0]?.id
  }

  async mostRecentStakeAmount(account: string): Promise<number> {
    const blockAtExpiry = 13261953
    const result = await this.query<{ userLockups: { id: string; value: string }[] }>(
      `query {
          userLockups(where: { account: "${account}", value_gt: 0 }, block: { number: ${blockAtExpiry} }) {
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
