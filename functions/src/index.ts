import { ApolloServer } from 'apollo-server-cloud-functions'
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'
import * as express from 'express'
import * as functions from 'firebase-functions'
import type { Request } from 'firebase-functions/lib/providers/https'

import { typeDefs } from './graphql/typeDefs'
import { dataSources } from './dataSources'
import { resolvers } from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageDisabled()],
})

const handler = server.createHandler() as unknown as (req: Request, resp: express.Response) => Promise<void>

export const questbook = functions.https.onRequest(handler)
