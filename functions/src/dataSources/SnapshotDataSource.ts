import { Pool } from 'undici'
import { HTTPDataSource } from 'apollo-datasource-http'

export class SnapshotDataSource extends HTTPDataSource {
  private static baseURL = 'https://hub.snapshot.org'

  constructor() {
    const pool = new Pool(SnapshotDataSource.baseURL)
    super(SnapshotDataSource.baseURL, {
      pool,
      clientOptions: {
        bodyTimeout: 15000,
        headersTimeout: 5000,
      },
      requestOptions: {
        headers: {
          'X-Client': 'client',
        },
      },
    })
  }

  async query<T>(query: string) {
    const result = await super.post<{ errors?: { message: string }[]; data: T }>('/graphql', {
      json: true,
      body: JSON.stringify({ query }),
    })

    if (result.body.errors) {
      throw new Error(`Query error: ${result.body.errors}`)
    }

    return result
  }

  async didVote(account: string) {
    const result = await this.query<{ votes: { id: string }[] }>(`{
      votes(
        where: {
          space: "mstablegovernance.eth",
          voter: "${account}"
        },
        first: 1
      ) {
        id
      }
    }`)
    return !!result.body.data?.votes?.[0]?.id
  }

  async getHighestVotesForRecentProposals() {
    const result = await this.query<{ proposals: { id: string; votes: number }[] }>(`{
      proposals(
        first: 5,
        skip: 0,
        where: {
          space_in: ["mstablegovernance.eth"],
        },
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        votes
      }
    }`)
    const entries = (result.body.data?.proposals ?? []).map((p) => p.votes).sort()
    return entries.length > 0 ? entries[entries.length - 1] : 0
  }
}
