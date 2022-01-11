import { GraphQLClient } from 'graphql-request'
import { DocumentNode } from 'graphql'
import { gql } from 'apollo-server-cloud-functions'

export class SnapshotDataSource {
  readonly client: GraphQLClient

  constructor() {
    this.client = new GraphQLClient('https://hub.snapshot.org/graphql')
  }

  async query<T, V = unknown>(documentNode: DocumentNode, variables?: V) {
    return this.client.request<T, V>(documentNode, variables)
  }

  async didVote(account: string) {
    const result = await this.query<{ votes: { id: string }[] }, { account: string }>(
      gql`
        query DidVote($account: String!) {
          votes(where: { space: "mstablegovernance.eth", voter: $account }, first: 1) {
            id
          }
        }
      `,
      { account },
    )
    return !!result.votes?.[0]?.id
  }

  async getHighestVotesForRecentProposals() {
    const result = await this.query<{ proposals: { id: string; votes: number }[] }>(
      gql`
        query Proposals {
          proposals(first: 5, where: { space: "mstablegovernance.eth" }, orderBy: "created", orderDirection: desc) {
            id
            votes
          }
        }
      `,
    )
    const entries = (result.proposals ?? []).map((p) => p.votes).sort()
    return entries.length > 0 ? entries[entries.length - 1] : 0
  }
}
