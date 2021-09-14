import { logger } from 'firebase-functions'

import { Resolvers, QuestCompletionQueueItem, UserQuest } from '../graphql/types'
import { DataSources } from '../dataSources'

import { QUESTS } from '../quests'
import { updateQuestForUser } from './updateQuestForUser'
import { fetchQuest } from './fetchQuest'
import { verifySigningAddress } from './utils'
import { QuestDefinition } from '../quests/types'

export const getQuestDefinition = (questId: string) => QUESTS.find((_questDefinition) => _questDefinition.id === questId) ?? null

export const resolvers: Resolvers<{ dataSources: DataSources }> = {
  Query: {
    quests: async (_ctx, { userId: _userId }, { dataSources }) => {
      const userId = _userId?.toLowerCase()
      const user = userId ? await dataSources.users.getOrCreate(userId) : undefined
      return Promise.all(QUESTS.map((questDefinition) => fetchQuest(questDefinition, user)))
    },

    quest: async (_ctx, { questId, userId: _userId }, { dataSources }) => {
      const userId = _userId?.toLowerCase()

      const questDefinition = getQuestDefinition(questId)
      if (!questDefinition) return null

      const user = userId ? await dataSources.users.getOrCreate(userId) : undefined

      return fetchQuest(questDefinition, user)
    },

    user: async (_ctx, { userId: _userId }, { dataSources }) => {
      const userId = _userId?.toLowerCase()
      const user = await dataSources.users.getOrCreate(userId)

      const { optInQueue, id } = user
      return {
        id,
        optInQueue: !!optInQueue,
        // Handled by User resolver
        quests: [],
      }
    },

    queue: async (_ctx, _args, { dataSources }) => {
      const optedInUsers = await dataSources.users.findManyByQuery((collection) => collection.where('optInQueue', '==', true), { ttl: 60 })

      return optedInUsers.flatMap(({ id: userId, quests }) => {
        const completedQuests = quests.filter((quest) => quest.complete)

        return completedQuests
          .map<QuestCompletionQueueItem | null>(({ questId }) => {
            const questDefinition = QUESTS.find((q) => q.id === questId) as QuestDefinition

            if (!questDefinition || typeof questDefinition.ethereumId !== 'number') {
              logger.warn(`Could not find quest definition/ethereumId for ${userId}/${questId}`)
              return null
            }

            return {
              ethereumId: questDefinition.ethereumId,
              userId,
            }
          })
          .filter(Boolean) as QuestCompletionQueueItem[]
      })
    },
  },

  User: {
    quests: async ({ id }, _args, { dataSources }) => {
      const user = await dataSources.users.getOrCreate(id)
      const quests = await Promise.all(QUESTS.map((questDefinition) => fetchQuest(questDefinition, user)))
      return quests.map<UserQuest | null>((quest) => quest.userQuest).filter(Boolean) as UserQuest[]
    },
  },

  Mutation: {
    updateQuest: async (_ctx, { userId: _userId, questId }, { dataSources }) => {
      const userId = _userId.toLowerCase()

      const questDefinition = getQuestDefinition(questId)
      if (!questDefinition) throw new Error('Quest not found')

      const user = await dataSources.users.getOrCreate(userId)

      await updateQuestForUser(user, questId, dataSources)

      return fetchQuest(questDefinition, user)
    },

    updateQuests: async (_ctx, { userId: _userId }, { dataSources }) => {
      const userId = _userId.toLowerCase()
      const user = await dataSources.users.getOrCreate(userId)

      for (const quest of QUESTS) {
        await updateQuestForUser(user, quest.id, dataSources)
      }

      return QUESTS.map((questDefinition) => fetchQuest(questDefinition, user))
    },

    queueOptIn: async (_ctx, { userId: _userId, signature }, { dataSources }) => {
      const userId = _userId.toLowerCase()

      const verified = verifySigningAddress('I am joining the queue for automatic quest completion', userId, signature)

      if (verified) {
        await dataSources.users.optInQueue(userId)
      }

      const { id, optInQueue } = await dataSources.users.getOrCreate(userId)
      return { id, optInQueue: !!optInQueue, quests: [] }
    },

    queueOptOut: async (_ctx, { userId: _userId, signature }, { dataSources }) => {
      const userId = _userId.toLowerCase()

      const verified = verifySigningAddress('I am leaving the queue for automatic quest completion', userId, signature)

      if (verified) {
        await dataSources.users.optOutQueue(userId)
      }

      const { id, optInQueue } = await dataSources.users.getOrCreate(userId)
      return { id, optInQueue: !!optInQueue, quests: [] }
    },
  },
}
