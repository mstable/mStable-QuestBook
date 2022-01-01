import { QuestObjective } from '../types'

export const delegatooor: QuestObjective = {
  id: 'delegatooor',
  title: 'Delegatooor',
  description: 'Delegated voting power. You trust the process.',
  points: 2,
  async checker(account, delegates, dataSources) {
    const delegatesStkMTA = await dataSources.stakedTokenMTA.contract.delegates(account)
    const delegatesStkBPT = await dataSources.stakedTokenBPT.contract.delegates(account)
    const complete = delegatesStkMTA.toLowerCase() !== account || delegatesStkBPT.toLowerCase() !== account
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
