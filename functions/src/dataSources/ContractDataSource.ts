import { DataSource } from 'apollo-datasource'

export class ContractDataSource<TContract> extends DataSource {
  readonly contract: TContract

  constructor(contract: TContract) {
    super()
    this.contract = contract
  }

  // TODO consider adding caching (see DataSource.initialize)
}
