import { QuestObjective } from '../types'

export const setDial: QuestObjective = {
  id: 'setDial',
  title: 'Emissions Controllllooooooor',
  description: 'Set voting weights on Dials',
  points: 4,
  async checker(account, dataSources) {
    const preferences = await dataSources.emissionsController.contract.getVoterPreferences(account)
    const complete = preferences.some((pref) => pref.weight.gt(0))
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
