import { ApolloError, ApolloServer, AuthenticationError, UserInputError } from 'apollo-server-cloud-functions'
import { GraphQLError } from 'graphql'
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
import * as express from 'express'
import * as functions from 'firebase-functions'
import type { Request } from 'firebase-functions/lib/providers/https'

import { typeDefs } from './graphql/typeDefs'
import { dataSources } from './dataSources'
import { resolvers } from './resolvers'
import { ApolloServerPluginError } from './plugins'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: dataSources as never, // not all are datasources
  formatError: (error) => {
    if (
      error.originalError instanceof AuthenticationError ||
      error.originalError instanceof UserInputError ||
      error.originalError instanceof GraphQLError
    ) {
      return error.originalError
    }
    return new ApolloError('Internal server error')
  },
  debug: false,
  introspection: true,
  plugins: [
    ApolloServerPluginLandingPageDisabled(),
    new ApolloServerPluginError((error) => {
      functions.logger.error(error)
    }) as never,
  ],
})

const handler = server.createHandler() as unknown as (req: Request, resp: express.Response) => Promise<void>

export const questbook = functions.https.onRequest(handler)
