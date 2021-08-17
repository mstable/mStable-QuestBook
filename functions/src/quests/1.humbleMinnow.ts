import { BigNumber } from 'ethers'

import { QuestChecker } from './types'

const checker: QuestChecker = async (dataSources, account) => {
  const balance = await dataSources.stakedToken.contract.balanceOf(account)

  // One base unit sounds good to me
  const threshold = BigNumber.from(1)

  const complete = balance.gte(threshold)

  return { complete }
}

export default [1, checker] as const
