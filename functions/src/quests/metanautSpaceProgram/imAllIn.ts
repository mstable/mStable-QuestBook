import { QuestObjective } from '../types'

export const imAllIn: QuestObjective = {
  id: 'imAllIn',
  title: "I'm All In",
  description: 'Aped into one Dial with 100% of your vote',
  points: 5,
  async checker(account, delegates, dataSources) {
    let complete = false
    let progress = 0

    for (const userId of delegates) {
      const preferences = await dataSources.emissionsController.contract.getVoterPreferences(userId)
      complete = preferences.filter((pref) => pref.weight.gt(0)).length === 1

      progress = complete ? 1 : 0

      if (complete) break
    }

    return {
      complete,
      progress,
    }
  },
}
