import { gql } from 'apollo-server-cloud-functions'

export const typeDefs = gql`
  type Quest {
    id: ID!
    ethereumId: Int
    requiredPoints: Float
    objectives: [QuestObjective!]!
    title: String!
    description: String!
    imageURI: String
    userQuest(userId: ID!): UserQuest
  }

  type QuestObjective {
    id: ID!
    points: Float!
    title: String!
    description: String!
  }

  type UserQuest {
    id: ID!
    complete: Boolean!
    progress: Float
    signature: String
    objectives: [UserQuestObjective!]
  }

  type UserQuestObjective {
    id: ID!
    complete: Boolean!
    progress: Float
  }

  type User {
    id: ID!
    optInQueue: Boolean!
    quests: [UserQuest!]!
  }

  type QuestCompletionQueueItem {
    ethereumId: Int!
    userId: ID!
  }

  type Query {
    quests(userId: ID): [Quest!]!
    quest(questId: ID!, userId: ID): Quest
    queue: [QuestCompletionQueueItem!]!
    user(userId: ID!): User!
  }

  type Mutation {
    updateQuest(userId: ID!, questId: ID!): Quest!
    updateQuests(userId: ID!): [Quest!]!
    queueOptIn(userId: ID!, signature: String!): User!
    queueOptOut(userId: ID!, signature: String!): User!
  }

  query Quests($userId: ID!, $hasUser: Boolean!) {
    quests {
      id
      ethereumId
      title
      description
      imageURI
      objectives {
        id
        title
        description
        points
      }
      userQuest(userId: $userId) @include(if: $hasUser) {
        id
        signature
        complete
        progress
        objectives {
          id
          complete
          progress
        }
      }
    }
  }
`
