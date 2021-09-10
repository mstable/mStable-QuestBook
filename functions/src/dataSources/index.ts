import { QuestManager__factory } from './QuestManager__factory' // TODO replace with @mstable/protocol
import { StakedToken__factory } from './StakedToken__factory' // TODO replace with @mstable/protocol
import { providers } from 'ethers'
import { config } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import CollectionReference = firestore.CollectionReference

import { ContractDataSource } from './ContractDataSource'
import { UserDoc, UsersDataSource } from './UsersDataSource'
import { LegacyGovSubgraphDataSource } from './LegacyGovSubgraphDataSource'
import { QuestManager } from './QuestManager'
import { StakedToken } from './StakedToken'
import { PolygonProtocolSubgraphDataSource } from './PolygonProtocolSubgraphDataSource'
import { MainnetProtocolSubgraphDataSource } from './MainnetProtocolSubgraphDataSource'

export interface DataSources {
  // Firestores
  users: UsersDataSource

  // Contracts
  questManager: ContractDataSource<QuestManager>
  stakedToken: ContractDataSource<StakedToken> // TODO add BPT as well

  // Subgraphs
  legacyGovSubgraph: LegacyGovSubgraphDataSource
  polygonProtocolSubgraph: PolygonProtocolSubgraphDataSource
  mainnetProtocolSubgraph: MainnetProtocolSubgraphDataSource
}

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG as string)

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  ...adminConfig,
})

export const dataSources = (): DataSources => {
  const {
    network,
    infura_key,
    infura_id,
    data_sources: { staked_token_address, quest_manager_address },
  } = config().questbook

  const provider = new providers.InfuraProvider(network, { projectId: infura_id, projectSecret: infura_key })

  const stakedToken = StakedToken__factory.connect(staked_token_address, provider)
  const questManager = QuestManager__factory.connect(quest_manager_address, provider)

  const firestore = admin.firestore()
  const usersCollection = firestore.collection('users') as CollectionReference<UserDoc>

  return {
    questManager: new ContractDataSource(questManager as never),
    stakedToken: new ContractDataSource(stakedToken as never),
    users: new UsersDataSource(usersCollection),
    legacyGovSubgraph: LegacyGovSubgraphDataSource.create(),
    polygonProtocolSubgraph: PolygonProtocolSubgraphDataSource.create(),
    mainnetProtocolSubgraph: MainnetProtocolSubgraphDataSource.create(),
  }
}
