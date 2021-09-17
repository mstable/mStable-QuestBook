import { UserDoc } from '../dataSources/UsersDataSource'
import { QuestDefinition } from '../quests/types'
import { UserQuest } from '../graphql/types'

export const getQuest = (quest: QuestDefinition, user?: UserDoc) => {
  const { id, ethereumId, objectives, title, description, requiredPoints, imageURI } = quest
  let userQuest: UserQuest | null = null

  const userQuestDoc = user?.quests?.find((item) => item.questId === id) ?? {
    complete: false,
    objectives: [],
    questId: id,
    progress: 0,
  }

  if (userQuestDoc && user) {
    const { complete, progress, signature, objectives: userObjectives } = userQuestDoc

    userQuest = {
      id: `${id}.${user.id}`,
      signature,
      complete,
      progress,
      objectives: objectives.map((objective) => ({
        ...objective,
        ...(userObjectives?.find((userObjective) => userObjective.objectiveId === objective.id) ?? {
          complete: false,
          progress: 0,
        }),
      })),
    }
  }

  return {
    id,
    objectives,
    ethereumId,
    requiredPoints,
    imageURI,
    title,
    description,
    userQuest,
  }
}
