import { GamifiedToken, StakedToken } from '@mstable/protocol'
import { DataSource } from 'apollo-datasource'

import { ContractDataSource } from './ContractDataSource'

export type DataSources = { [key: string]: DataSource } & {
  // TODO add more contracts, extend ContractDataSource as needed
  // TODO add subgraphs as needed
  stakedToken: ContractDataSource<StakedToken>
  gamifiedToken: ContractDataSource<GamifiedToken>
}
