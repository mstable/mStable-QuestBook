import { FirestoreDataSource } from 'apollo-datasource-firestore'
import { QUESTS } from '../quests'

interface UserQuestObjectiveDoc {
  objectiveId: string
  complete: boolean
  progress: number
}

interface UserQuestDoc {
  questId: string
  complete: boolean
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
    return this.updateUserQuest(id, questId, { signature, complete: true, progress: 1 })
  }

  async completeQuestObjective(id: string, questId: string, objectiveId: string) {
    return this.updateUserQuestObjective(id, questId, objectiveId, { complete: true, progress: 1 })
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

    const userQuests = user.quests.map((userQuest) => (userQuest.questId === questId ? { ...userQuest, ...mod } : userQuest))

    return this.collection.doc(id).set({ quests: userQuests }, { merge: true })
  }

  private async updateUserQuestObjective(id: string, questId: string, objectiveId: string, mod: Partial<UserQuestObjectiveDoc>) {
    const user = await this.ensureUserQuestObjectiveExists(id, questId, objectiveId)

    const userQuest = this.getUserQuest(user, questId)
    const userQuestObjective = this.getUserQuestObjective(userQuest, objectiveId)

    const userQuests = user.quests.map((_userQuest) =>
      _userQuest.questId === questId
        ? {
            ...userQuest,
            objectives: userQuest.objectives.map((_objective) =>
              _objective.objectiveId === objectiveId ? { ...userQuestObjective, ...mod } : _objective,
            ),
          }
        : _userQuest,
    )

    return this.collection.doc(id).set({ quests: userQuests }, { merge: true })
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
