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
      increaseLockAmountTransactions: { id: string; value: string }[]
      createLockTransactions: { id: string; value: string }[]
    }>(
      `query {
          userLockups(where: { account: "${account}", value_gt: 0 }, block: { number: ${blockAtExpiry} }) {
              id
              value
          }
          createLockTransactions(where: { sender: "${account}" }) { id value }
          increaseLockAmountTransactions(where: { sender: "${account}" }) { id value }
      }`,
    )

    const { userLockups, createLockTransactions = [], increaseLockAmountTransactions = [] } = result.body.data

    if (!userLockups[0]?.id) {
      if (!createLockTransactions[0]?.id && !increaseLockAmountTransactions[0]?.id) {
        return 0
      }

      // If they don't have balance at this block, use lock transactions
      // to approximate a staked amount
      const lockedTotal = createLockTransactions.reduce((prev, { value }) => prev.add(BigNumber.from(value)), BigNumber.from(0))
      const increasedTotal = increaseLockAmountTransactions.reduce((prev, { value }) => prev.add(BigNumber.from(value)), BigNumber.from(0))
      const total = lockedTotal.add(increasedTotal)
      return parseFloat(utils.formatUnits(total))
    }

    return parseInt(userLockups[0]?.value ?? '0') / 1e18
  }
}
