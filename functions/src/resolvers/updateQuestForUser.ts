import { constants } from 'ethers'
import { logger } from 'firebase-functions'

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
    // Check for completedAt as well, because old objectives don't
    // have completedAt set, and we have changed the points.
    ({ id }) => !userQuest || !userQuest.objectives.find((item) => item.objectiveId === id && item.complete && item.completedAt),
  )

  // Get the user's delegates; some quests allow completion for delegators
  const delegates = new Set<string>(
    [userId, await dataSources.stakedTokenMTA.contract.delegates(userId), await dataSources.stakedTokenBPT.contract.delegates(userId)]
      .filter((addr) => addr !== constants.AddressZero)
      .map((addr) => addr.toLowerCase()),
  )

  // Run the checker for each objective
  const objectiveCompletions = await Promise.all(
    nonCompletedObjectives.map(async ({ id: objectiveId, checker }) => {
      try {
        const objectiveCompletion = await checker(userId, delegates, dataSources)
        return { userId, objectiveId, ...objectiveCompletion }
      } catch (error) {
        logger.warn(`Error checking objective ${objectiveId}`, error)
        return { userId, objectiveId, progress: 0, complete: false }
      }
    }),
  )

  // Complete or set progress for objectives
  for (const objectiveCompletion of objectiveCompletions) {
    const { userId, complete, progress, objectiveId } = objectiveCompletion
    if (complete) {
      await dataSources.users.completeQuestObjective(userId, questId, objectiveId)
    } else if (progress) {
      await dataSources.users.setQuestObjectiveProgress(userId, questId, objectiveId, progress)
    }
  }

  // Get new status
  userQuest = await dataSources.users.getOrCreateUserQuest(userId, questId)
  const completedObjectives = userQuest.objectives.filter((item) => item.complete)
  const allObjectivesCompleted = completedObjectives.length === quest.objectives.length

  // Try to complete
  if (allObjectivesCompleted && typeof quest.ethereumId === 'number') {
    let signature
    const ethereumQuest = await dataSources.questManager.contract.getQuest(quest.ethereumId)
    const withinCompletionWindow = getUnixTime(Date.now()) <= ethereumQuest.expiry
    if (withinCompletionWindow) {
      signature = await signQuestSubmission(quest.ethereumId.toString(), userId)
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
