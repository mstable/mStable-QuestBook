import { Resolvers, UserQuest } from '../graphql/types'
import { DataSources } from '../dataSources'
import { UserDoc } from '../dataSources/UsersDataSource'

import { QUESTS } from '../quests'
import { updateQuestForUser } from './updateQuestForUser'

export const resolvers: Resolvers<{ dataSources: DataSources }> = {
  Query: {
    quests: async (_ctx, { userId }, { dataSources }) => {
      let user: UserDoc | null = null
      if (userId) {
        user = await dataSources.users.getOrCreate(userId.toLowerCase())
      }

      return QUESTS.map(({ id, ethereumId, title, description, objectives }) => {
        let userQuest: UserQuest | null = null

        const userQuestDoc = user?.quests.find((item) => item.questId === id) ?? {
          complete: false,
          objectives: [],
          questId: id,
          progress: 0,
        }

        if (userQuestDoc && userId) {
          const { complete, progress, signature, objectives: userObjectives } = userQuestDoc

          userQuest = {
            id: `${id}.${userId}`,
            signature,
            complete,
            progress,
            objectives: objectives.map((objective) => ({
              ...objective,
              ...(userObjectives.find((userObjective) => userObjective.objectiveId === objective.id) ?? {
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
          title,
          description,
          userQuest,
        }
      })
    },
  },
  Mutation: {
    updateQuest: async (_ctx, { userId: _userId, questId }, { dataSources }) => {
      const userId = _userId.toLowerCase()
      const user = await dataSources.users.getOrCreate(userId)

      return updateQuestForUser(user, questId, dataSources)
    },
    updateQuests: async (_ctx, { userId: _userId }, { dataSources }) => {
      const userId = _userId.toLowerCase()
      const user = await dataSources.users.getOrCreate(userId)

      for (const quest of QUESTS) {
        await updateQuestForUser(user, quest.id, dataSources)
      }

      return true
    },
  },
}
