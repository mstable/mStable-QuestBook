import { gql } from 'apollo-server-cloud-functions'

export const typeDefs = gql`
  type Quest {
    id: ID!
    ethereumId: Int
    objectives: [QuestObjective!]!
    title: String!
    description: String!
    imageURI: String
    userQuest(userId: ID!): UserQuest
  }

  type QuestObjective {
    id: ID!
    points: Int!
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

  type Query {
    quests(userId: ID): [Quest!]!
  }

  type Mutation {
    updateQuest(userId: ID!, questId: ID!): Boolean!
    updateQuests(userId: ID!): Boolean!
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
