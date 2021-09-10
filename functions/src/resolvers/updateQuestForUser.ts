import { UserDoc } from '../dataSources/UsersDataSource'
import { DataSources } from '../dataSources'
import { QUESTS } from '../quests'
import { getUnixTime, signQuestSubmission } from './utils'

export const updateQuestForUser = async ({ id: userId, quests }: UserDoc, questId: string, dataSources: DataSources) => {
  let userQuest = quests.find((item) => item.questId === questId)

  // Happy path: completed the quest and got the signature
  if (userQuest && userQuest.objectives.every((item) => item.complete) && userQuest.signature) {
    return true
  }

  // Ensure the user has started the quest
  if (!userQuest) {
    userQuest = await dataSources.users.getOrCreateUserQuest(userId, questId)
  }

  // Get the quest definition
  const quest = QUESTS.find((item) => item.id === questId)
  if (!quest) {
    throw new Error('Quest definition not found')
  }

  // Find non-completed objectives
  const nonCompletedObjectives = quest.objectives.filter(
    ({ id }) => !userQuest || !userQuest.objectives.find((item) => item.objectiveId === id && item.complete),
  )

  // Run the checker for each objective
  const objectiveCompletions = await Promise.all(
    nonCompletedObjectives.map(async ({ id: objectiveId, checker }) => {
      const objectiveCompletion = await checker(userId, dataSources)
      return { userId, objectiveId, ...objectiveCompletion }
    }),
  )

  // Complete or set progress for objectives
  await Promise.all(
    objectiveCompletions.map(async ({ userId, complete, progress, objectiveId }) => {
      if (complete) return dataSources.users.completeQuestObjective(userId, questId, objectiveId)
      if (progress) return dataSources.users.setQuestObjectiveProgress(userId, questId, objectiveId, progress)
      return undefined
    }),
  )

  // Get new status
  userQuest = await dataSources.users.getOrCreateUserQuest(userId, questId)
  const completedObjectives = userQuest.objectives.filter((item) => item.complete)
  const allObjectivesCompleted = completedObjectives.length === quest.objectives.length

  // Try to complete
  if (allObjectivesCompleted) {
    let signature
    if (typeof quest.ethereumId === 'number') {
      const ethereumQuest = await dataSources.questManager.contract.getQuest(quest.ethereumId)
      const withinCompletionWindow = getUnixTime(Date.now()) <= ethereumQuest.expiry
      if (withinCompletionWindow) {
        signature = await signQuestSubmission(quest.ethereumId.toString(), userId)
      }
    }

    await dataSources.users.completeQuest(userId, questId, signature)
    return true
  }

  // Update quest progress
  const completedPoints = quest.objectives
    .filter((objective) => completedObjectives.find(({ objectiveId }) => objective.id === objectiveId))
    .reduce((prev, current) => prev + current.points, 0)

  const questProgress = completedPoints / quest.requiredPoints

  await dataSources.users.setQuestProgress(userId, questId, questProgress)
  return true
}
