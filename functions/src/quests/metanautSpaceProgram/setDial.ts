import { QuestObjective } from '../types'

export const setDial: QuestObjective = {
  id: 'setDial',
  title: 'Emissions Controllllooooooor',
  description: 'Set voting weights on Dials',
  points: 10,
  async checker(account, delegates, dataSources) {
    let complete = false
    let progress = 0

    for (const userId of delegates) {
      const preferences = await dataSources.emissionsController.contract.getVoterPreferences(userId)
      complete = preferences.some((pref) => pref.weight.gt(0))
      progress = complete ? 1 : 0

      if (complete) break
    }

    return {
      complete,
      progress,
    }
  },
}
