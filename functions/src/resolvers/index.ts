import { Resolvers, Quest, User, QuestSubmission } from '../graphql/types'
import { DataSources } from '../dataSources/types'
import { UserDoc } from '../dataSources/UsersDataSource'
import { getQuestDefinition, isQuestDefined, questsMap } from '../quests'
import { deferUpdate, verifySigningAddress, signQuestSubmission } from './utils'
import { MetadataDoc } from '../dataSources/MetadataDataSource'

export const resolvers: Resolvers<{ dataSources: DataSources }> = {
  Query: {
    quest: async (_, { id }, { dataSources }) => {
      const questDefined = isQuestDefined(id)
      if (!questDefined) return null

      const metadata = await dataSources.metadata.findOne(id)
      console.log(id, typeof id, metadata)
      return { id, metadata }
    },

    quests: async (_, _params, { dataSources }) => {
      const ids = Object.keys(questsMap).sort()
      const docs = await dataSources.metadata.findManyByIds(ids, { ttl: 60 * 5 })
      const metadataObj = Object.fromEntries(docs.filter(Boolean).map((doc) => [(doc as MetadataDoc).id, doc as MetadataDoc]))
      return ids.map<Quest>((id) => {
        const metadata = metadataObj[id] ?? null
        return { id, metadata }
      })
    },

    user: async (_, { account }, { dataSources }) => getUser(account, dataSources),

    optInQueue: async (_, _params, { dataSources }) => {
      const docs = await dataSources.users.findQueueOptIns(60 * 5)
      return getUsers(docs)
    },
  },

  QuestSubmission: {
    quest: async ({ quest }, _, { dataSources }) => getQuest(quest as unknown as string, dataSources),
    user: async ({ user }, _, { dataSources }) => getUser(user as unknown as string, dataSources),
  },

  Quest: {
    submission: async ({ id }, { account: _account }, { dataSources }) => {
      const account = _account.toLowerCase()
      const user = await dataSources.users.ensureExists(account)
      if (!user) return null
      return getSubmission(id, user, dataSources)
    },
  },

  User: {
    queue: async ({ queue }, _, { dataSources }) => Promise.all((queue as unknown as string[]).map((id) => getQuest(id, dataSources))),
  },

  Mutation: {
    queueOptIn: async (_, { account: _account, signature }, { dataSources }) => {
      const account = _account.toLowerCase()
      const verified = verifySigningAddress('I am joining the queue for automatic quest completion', account, signature)
      if (verified) await dataSources.users.queueOptIn(account)
      return verified
    },

    queueOptOut: async (_, { account: _account, signature }, { dataSources }) => {
      const account = _account.toLowerCase()
      const verified = verifySigningAddress('I am leaving the queue for automatic quest completion', account, signature)
      if (verified) await dataSources.users.queueOptOut(account)
      return verified
    },

    setMetadata: async (_, { signature, json }, { dataSources }) => {
      // TODO use quest master address
      const verified = verifySigningAddress(json, '0xdf38727b309f466085133648af2db563935b1c65', signature)
      const { title, description, id, imageUrl } = JSON.parse(json)
      if (!title || !description || !id) throw new Error('Invalid metadata')
      if (verified) {
        await dataSources.metadata.update(id, { title, description, imageUrl: imageUrl ?? null })
      }
      return verified
    },
  },
}

const getQuest = async (id: string, dataSources: DataSources) => {
  const metadataDoc = await dataSources.metadata.findOne(id)
  return {
    id,
    metadata: metadataDoc ? { title: metadataDoc.title, description: metadataDoc.description, imageUrl: metadataDoc.imageUrl } : null,
  }
}

const getUser = async (account: string, dataSources: DataSources): Promise<User | null> => {
  const id = account.toLowerCase()

  const doc = await dataSources.users.ensureExists(id)
  if (!doc) return null

  const { completed, queue, queueOptIn, address } = doc
  return {
    id,
    address,
    completed: completed.map((_id) => questsMap[parseInt(_id)]),
    queue: queue as never,
    queueOptIn,
  } as User
}

const getUsers = (docs: UserDoc[]): User[] =>
  docs.map<User>(({ id, completed, queue, queueOptIn, address }) => ({
    id,
    address,
    completed: completed.map((_id) => questsMap[parseInt(_id)]),
    queue: queue as never,
    queueOptIn,
  }))

const getSubmission = async (id: string, user: UserDoc, dataSources: DataSources): Promise<QuestSubmission | null> => {
  const account = user.id
  let submission = { quest: id as never, user: account as never, complete: false } as QuestSubmission

  const { checker } = getQuestDefinition(id)

  // Check on-chain first; source of truth
  const hasCompleted = await dataSources.stakedToken.contract.hasCompleted(account, id)
  if (hasCompleted) {
    if (!user.completed.includes(id)) {
      // Update Firestore quest completion
      deferUpdate(dataSources.users.completeQuest(account, id))
    }

    // No signature needed if completed on-chain
    return { ...submission, complete: true }
  }

  // Check the quest according to its checker
  const questCompletion = await checker(dataSources, account)
  submission = { ...submission, ...questCompletion }

  // No signature if not complete
  if (!questCompletion.complete) return submission

  // Sign the quest with the quest signer key
  const signature = await signQuestSubmission(id, account)

  if (!user.queue.includes(id)) {
    // Add quest to the queue regardless of user opt-in, because
    // we want to compile a list before they (might) opt in
    deferUpdate(dataSources.users.queueQuest(account, id))
  }

  return { ...submission, signature }
}
