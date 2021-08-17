import { FirestoreDataSource } from 'apollo-datasource-firestore'

export interface MetadataDoc {
  readonly id: string // quest ID
  readonly collection: 'users'
  title: string
  description: string
  imageUrl?: string
}

export class MetadataDataSource extends FirestoreDataSource<MetadataDoc, null> {
  async findOne(id: string) {
    const doc = await this.findOneById(id)
    if (!doc) return null
    const { title, description, imageUrl } = doc
    return { title, description, imageUrl }
  }

  async create(id: string, doc: Omit<MetadataDoc, 'id' | 'collection'>) {
    return this.createOne({ id, ...doc })
  }

  async update(id: string, doc: Partial<Omit<MetadataDoc, 'id' | 'collection'>>) {
    return this.updateOnePartial(id, doc)
  }
}
