import { gql } from 'apollo-server-cloud-functions'

export const typeDefs = gql`
  type QuestMetadata {
    title: String!
    description: String!
    imageUrl: String
    # More...
  }

  type Quest {
    id: ID!
    metadata: QuestMetadata
    submission(account: ID!): QuestSubmission
  }

  type QuestSubmission {
    complete: Boolean!
    progress: Float
    signature: String
    quest: Quest!
    user: User
  }

  type Query {
    quest(id: ID!): Quest
    quests: [Quest]!
    user(account: ID!): User
    optInQueue: [User]!
  }

  type User {
    id: ID!
    queueOptIn: Boolean
    completed: [Quest]!
    queue: [Quest]!
  }

  type Mutation {
    queueOptIn(account: ID!, signature: String!): Boolean!
    queueOptOut(account: ID!, signature: String!): Boolean!
    setMetadata(json: String!, signature: String!): Boolean!
  }
`
