import { gql } from 'apollo-server-cloud-functions'

export const typeDefs = gql`
  type QuestMetadata {
    title: String!
    description: String!
    # More...
  }

  type Quest {
    id: ID!
    metadata: QuestMetadata!
    submission(account: ID!): QuestSubmission
  }

  type QuestSubmission {
    complete: Boolean!
    progress: Float
    signature: String
  }

  type Query {
    quest(id: ID!): Quest
  }

  type Mutation {
    submitQuest(id: ID!, account: ID!): QuestSubmission!
  }
`
