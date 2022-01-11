import { BigNumber } from 'ethers'

import { QuestObjective } from '../types'

const scale = (exact: BigNumber) => parseInt(exact.toString()) / 1e18

export const saver: QuestObjective = {
  id: 'saver',
  title: 'Saver',
  description: 'Own > $1000 in mUSD Save/Vault',
  points: 20,
  async checker(account, delegates, dataSources) {
    const exchangeRate_ = await dataSources.imusd.contract.exchangeRate()
    const imusdBalance_ = await dataSources.imusd.contract.balanceOf(account)
    const imusdVaultBalance_ = await dataSources.imusdVault.contract.balanceOf(account)

    const exchangeRate = scale(exchangeRate_)
    const imusdBalance = scale(imusdBalance_)
    const imusdVaultBalance = scale(imusdVaultBalance_)

    const balance = exchangeRate * (imusdBalance + imusdVaultBalance)

    const threshold = 1000

    const complete = balance > threshold
    const progress = Math.min(1, balance / threshold)

    return {
      complete,
      progress,
    }
  },
}
