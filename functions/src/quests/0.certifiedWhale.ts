import { BigNumber, utils } from 'ethers'

import { QuestChecker } from './types'

const SCALE = BigNumber.from((1e18).toString())

const checker: QuestChecker = async (dataSources, account) => {
  // Use a dataSource
  const balance = await dataSources.stakedToken.contract.balanceOf(account)

  // A thousand? Crikey, that's a lot. Whale territory without a doubt.
  const threshold = SCALE.mul(1000)

  // Boolean for whether the quest is complete
  const complete = balance.gte(threshold)

  // Progress is optional; won't apply to all quests
  let progress = complete ? 1 : 0

  // Quantify the progress
  if (!complete && balance.gt(0)) {
    const balanceSimple = parseFloat(utils.formatUnits(balance))
    const thresholdSimple = parseFloat(utils.formatUnits(threshold))
    progress = balanceSimple / thresholdSimple
  }

  return { complete, progress }
}

export default [0, checker] as const
