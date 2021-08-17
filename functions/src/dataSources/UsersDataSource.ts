import { FirestoreDataSource } from 'apollo-datasource-firestore'
import * as admin from 'firebase-admin'

export interface UserDoc {
  readonly id: string // address
  readonly collection: 'users'
  address: string
  queueOptIn?: boolean
  queue: string[]
  completed: string[]
}

export class UsersDataSource extends FirestoreDataSource<UserDoc, null> {
  async ensureExists(address: string) {
    const user = await this.findOneById(address)
    return user ?? (await this.create(address))
  }

  async findQueueOptIns(ttl?: number) {
    const users = await this.findManyByQuery((c) => c.where('queueOptIn', '==', true), { ttl })
    return users.sort((a, b) => b.queue.length - a.queue.length)
  }

  async create(address: string) {
    return this.createOne({ address, id: address, queue: [], completed: [] })
  }

  async completeQuest(address: string, questId: string) {
    await this.ensureExists(address)
    return this.collection
      .doc(address)
      .update({ completed: admin.firestore.FieldValue.arrayUnion(questId), queue: admin.firestore.FieldValue.arrayRemove(questId) })
  }

  async queueQuest(address: string, questId: string) {
    await this.ensureExists(address)
    return this.collection.doc(address).update({ queue: admin.firestore.FieldValue.arrayUnion(questId) })
  }

  async queueOptIn(address: string) {
    await this.ensureExists(address)
    return this.updateOnePartial(address, { queueOptIn: true })
  }

  async queueOptOut(address: string) {
    await this.ensureExists(address)
    return this.updateOnePartial(address, { queueOptIn: false, queue: [] })
  }
}
