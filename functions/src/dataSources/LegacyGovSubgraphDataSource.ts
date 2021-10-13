import { SubgraphDataSource } from './SubgraphDataSource'
import { BigNumber, utils } from 'ethers'

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
    const result = await this.query<{
      userLockups: { id: string; value: string }[]
      withdrawTransactions: { id: string; value: string }[]
    }>(
      `query {
          userLockups(where: { account: "${account}", value_gt: 0 }, block: { number: ${blockAtExpiry} }) {
              id
              value
          }
          withdrawTransactions(where: { sender: "${account}" }) { id value }
      }`,
    )

    const { userLockups, withdrawTransactions } = result.body.data

    if (!userLockups[0]?.id) {
      if (!withdrawTransactions[0]?.id) {
        return 0
      }

      // If they don't have balance at this block, they may have withdrawn;
      // take the total withdrawn value.
      // Unlikely they staked all/withdrew all/staked all, so should be appropriate
      const totalWithdrawn = withdrawTransactions.reduce((prev, { value }) => prev.add(BigNumber.from(value)), BigNumber.from(0))
      return parseFloat(utils.formatUnits(totalWithdrawn))
    }

    return parseInt(userLockups[0]?.value ?? '0') / 1e18
  }
}
