import { HTTPDataSource } from 'apollo-datasource-http'
import { Pool } from 'undici'

export class SubgraphDataSource extends HTTPDataSource {
  private static baseURL = 'https://api.thegraph.com'

  private readonly subgraphPath: string

  constructor(subgraphPath: string) {
    const pool = new Pool(SubgraphDataSource.baseURL)
    super(SubgraphDataSource.baseURL, {
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
    this.subgraphPath = subgraphPath
  }

  async query<T>(query: string) {
    const result = await super.post<{ errors?: { message: string }[]; data: T }>(this.subgraphPath, {
      json: true,
      body: JSON.stringify({ query }),
    })

    if (result.body.errors) {
      throw new Error(`Query error: ${result.body.errors}`)
    }

    return result
  }
}
