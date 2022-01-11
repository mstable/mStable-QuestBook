import { BigNumber } from 'ethers'

import { QuestObjective } from '../types'

const scale = (exact: BigNumber) => parseInt(exact.toString()) / 1e18

export const saverPolygon: QuestObjective = {
  id: 'saverPolygon',
  title: 'Saver (Polygon)',
  description: 'Own > $1000 in mUSD Save/Vault on Polygon',
  points: 20,
  async checker(account, delegates, dataSources) {
    const exchangeRate_ = await dataSources.imusdPolygon.contract.exchangeRate()
    const imusdVaultBalance_ = await dataSources.imusdVaultPolygon.contract.balanceOf(account)
    const imusdFraxVaultBalance_ = await dataSources.imusdFraxVaultPolygon.contract.lockedLiquidityOf(account)
    const imusdBalance_ = await dataSources.imusdPolygon.contract.balanceOf(account)

    const exchangeRate = scale(exchangeRate_)
    const imusdBalance = scale(imusdBalance_)
    const imusdVaultBalance = scale(imusdVaultBalance_)
    const imusdFraxVaultBalance = scale(imusdFraxVaultBalance_)

    const balance = exchangeRate * (imusdBalance + imusdVaultBalance + imusdFraxVaultBalance)

    const threshold = 1000

    const complete = balance > threshold
    const progress = Math.min(1, balance / threshold)

    return {
      complete,
      progress,
    }
  },
}
