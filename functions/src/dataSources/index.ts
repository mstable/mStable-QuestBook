import { ERC20__factory } from '@mstable/protocol'
import { providers } from 'ethers'
import { config } from 'firebase-functions'

import { DataSources } from './types'
import { ContractDataSource } from './ContractDataSource'

export const dataSources = (): DataSources => {
  const {
    network,
    infura_key,
    infura_id,
    data_sources: { gamified_token_address, staked_token_address },
  } = config().questbook

  const provider = new providers.InfuraProvider(network, { projectId: infura_id, projectSecret: infura_key })

  // TODO use actual contract factories when they're supported in @mstable/protocol
  const gamifiedToken = ERC20__factory.connect(gamified_token_address, provider)
  const stakedToken = ERC20__factory.connect(staked_token_address, provider)

  // TODO add more contract sources
  // TODO add subgraph sources

  return {
    gamifiedToken: new ContractDataSource(gamifiedToken as never),
    stakedToken: new ContractDataSource(stakedToken as never),
  }
}
