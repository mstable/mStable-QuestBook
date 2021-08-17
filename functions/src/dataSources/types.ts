import { StakedToken } from './StakedToken' // TODO replace with @mstable/protocol
import { DataSource } from 'apollo-datasource'

import { ContractDataSource } from './ContractDataSource'
import { UsersDataSource } from './UsersDataSource'
import { MetadataDataSource } from './MetadataDataSource'

export type DataSources = { [key: string]: DataSource } & {
  // TODO add more contracts, extend ContractDataSource as needed
  // TODO add subgraphs as needed
  stakedToken: ContractDataSource<StakedToken>
  users: UsersDataSource
  metadata: MetadataDataSource
}
