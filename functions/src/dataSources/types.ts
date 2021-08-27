import { QuestManager } from './QuestManager' // TODO replace with @mstable/protocol
import { StakedToken } from './StakedToken' // TODO replace with @mstable/protocol
import { DataSource } from 'apollo-datasource'

import { ContractDataSource } from './ContractDataSource'
import { UsersDataSource } from './UsersDataSource'
import { MetadataDataSource } from './MetadataDataSource'

export type DataSources = { [key: string]: DataSource } & {
  // TODO add more contracts, extend ContractDataSource as needed
  // TODO add subgraphs as needed
  questManager: ContractDataSource<QuestManager>
  stakedToken: ContractDataSource<StakedToken>
  users: UsersDataSource
  metadata: MetadataDataSource
}
