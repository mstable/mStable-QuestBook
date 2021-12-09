import { QuestObjective } from '../types'

export const imAllIn: QuestObjective = {
  id: 'imAllIn',
  title: "I'm All In",
  description: 'Aped into one Dial with 100% of your vote',
  points: 3,
  async checker(account, dataSources) {
    const preferences = await dataSources.emissionsController.contract.getVoterPreferences(account)
    const complete = preferences.filter((pref) => pref.weight.gt(0)).length === 1
    return {
      complete,
      progress: complete ? 1 : 0,
    }
  },
}
