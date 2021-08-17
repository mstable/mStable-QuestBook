import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base'
import { GraphQLError } from 'graphql'
import { GraphQLRequestContextDidEncounterErrors } from 'apollo-server-types'

export class ApolloServerPluginError<T> implements ApolloServerPlugin<T> {
  constructor(protected errorHandler: (e: GraphQLError, requestContext: GraphQLRequestContextDidEncounterErrors<T>) => any) {}

  async requestDidStart(): Promise<GraphQLRequestListener<T>> {
    return {
      didEncounterErrors: async (requestContext) => {
        requestContext.errors.forEach((err) => {
          this.errorHandler(err, requestContext)
        })
      },
    }
  }
}
