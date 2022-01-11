import { Timestamp } from '@google-cloud/firestore'
import { FirestoreDataSource } from 'apollo-datasource-firestore'

import { QUESTS } from '../quests'

interface UserQuestObjectiveDoc {
  objectiveId: string
  complete: boolean
  completedAt?: number
  progress: number
}

interface UserQuestDoc {
  questId: string
  complete: boolean
  completedAt?: number
  progress: number
  signature?: string
  objectives: UserQuestObjectiveDoc[]
}

export interface UserDoc {
  readonly id: string // address
  readonly collection: 'users'
  quests: UserQuestDoc[]
  optInQueue?: boolean
}

export class UsersDataSource extends FirestoreDataSource<UserDoc, null> {
  async create(id: string) {
    const user = await this.createOne({ id, quests: [] })
    if (!user) throw new Error('Error creating user')
    return user
  }

  async getOrCreate(id: string): Promise<UserDoc> {
    // TODO findOneById is borked in this library, it misses docs... so no caching here
    const ref = await this.collection.doc(id).get()
    const user = ref?.data()
    return user ?? (await this.create(id))
  }

  async getOrCreateUserQuest(id: string, questId: string): Promise<UserQuestDoc> {
    const user = await this.ensureUserQuestExists(id, questId)
    return this.getUserQuest(user, questId)
  }

  async optInQueue(id: string) {
    return this.updateOnePartial(id, { optInQueue: true })
  }

  async optOutQueue(id: string) {
    return this.updateOnePartial(id, { optInQueue: false })
  }

  async setQuestProgress(id: string, questId: string, progress: number) {
    return this.updateUserQuest(id, questId, { progress })
  }

  async setQuestObjectiveProgress(id: string, questId: string, objectiveId: string, progress: number) {
    return this.updateUserQuestObjective(id, questId, objectiveId, { progress })
  }

  async completeQuest(id: string, questId: string, signature?: string) {
    return this.updateUserQuest(id, questId, { signature, complete: true, progress: 1, completedAt: Timestamp.now().seconds })
  }

  async completeQuestObjective(id: string, questId: string, objectiveId: string) {
    return this.updateUserQuestObjective(id, questId, objectiveId, {
      complete: true,
      progress: 1,
      completedAt: Timestamp.now().seconds,
    })
  }

  private async ensureUserQuestExists(id: string, questId: string): Promise<UserDoc> {
    const user = await this.getOrCreate(id)

    const userQuest = user.quests.find((_quest) => _quest.questId === questId)
    if (userQuest) return user

    const quest = QUESTS.find((item) => item.id === questId)
    if (!quest) {
      throw new Error('Quest definition not found')
    }

    const userQuests = [
      ...user.quests,
      {
        questId,
        complete: false,
        progress: 0,
        objectives: quest.objectives.map(({ id: objectiveId }) => ({ objectiveId, complete: false, progress: 0 })),
      },
    ]

    await this.collection.doc(id).set({ quests: userQuests }, { merge: true })

    return { ...user, quests: userQuests }
  }

  private async ensureUserQuestObjectiveExists(id: string, questId: string, objectiveId: string) {
    const user = await this.ensureUserQuestExists(id, questId)
    const userQuest = this.getUserQuest(user, questId)

    let userQuestObjective = userQuest.objectives.find((item) => item.objectiveId === objectiveId)
    if (userQuestObjective) return user

    userQuestObjective = { objectiveId, complete: false, progress: 0 }
    const objectives = [...userQuest.objectives, userQuestObjective]
    const userQuests = user.quests.map((_userQuest) => (_userQuest.questId === questId ? { ..._userQuest, objectives } : _userQuest))

    await this.collection.doc(id).set({ quests: userQuests }, { merge: true })

    return { ...user, quests: userQuests }
  }

  private async updateUserQuest(id: string, questId: string, mod: Partial<UserQuestDoc>) {
    const user = await this.ensureUserQuestExists(id, questId)

    const docRef = this.collection.doc(id)
    return this.collection.firestore.runTransaction(async (tx) => {
      const doc = await tx.get(docRef)
      const data = doc.data()
      if (!data) return

      const existing = data.quests.find((userQuest) => userQuest.questId === questId)
      const update = {
        ...data,
        quests: user.quests.map((userQuest) => {
          if (userQuest.questId === questId) {
            // Do not overwrite completedAt if set
            const completedAt = existing?.completedAt ?? mod.completedAt
            return { ...userQuest, ...mod, completedAt }
          }
          return userQuest
        }),
      }

      tx.set(docRef, update)
    })
  }

  private async updateUserQuestObjective(id: string, questId: string, objectiveId: string, mod: Partial<UserQuestObjectiveDoc>) {
    const user = await this.ensureUserQuestObjectiveExists(id, questId, objectiveId)

    const userQuest = this.getUserQuest(user, questId)
    const userQuestObjective = this.getUserQuestObjective(userQuest, objectiveId)

    const docRef = this.collection.doc(id)
    return this.collection.firestore.runTransaction(async (tx) => {
      const doc = await tx.get(docRef)
      const data = doc.data()
      if (!data) return

      const update = {
        ...data,
        quests: user.quests.map((userQuest) => {
          if (userQuest.questId === questId) {
            const existingObjective = userQuest.objectives.find((obj) => obj.objectiveId === objectiveId)

            // Do not overwrite completedAt if set
            const completedAt = existingObjective?.completedAt ?? mod.completedAt
            const objectives = userQuest.objectives.map((_objective) =>
              _objective.objectiveId === objectiveId ? { ...userQuestObjective, ...mod, completedAt } : _objective,
            )

            return { ...userQuest, objectives }
          }
          return userQuest
        }),
      }

      tx.set(docRef, update)
    })
  }

  private getUserQuest(user: UserDoc, questId: string) {
    const userQuest = user.quests.find((_quest) => _quest.questId === questId)
    if (!userQuest) {
      throw new Error('User quest not found')
    }
    return userQuest
  }

  private getUserQuestObjective(userQuest: UserQuestDoc, objectiveId: string) {
    const userQuestObjective = userQuest.objectives.find((_objective) => _objective.objectiveId === objectiveId)
    if (!userQuestObjective) {
      throw new Error('User quest objective not found')
    }
    return userQuestObjective
  }
}
