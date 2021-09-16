import {
  QuestManager,
  QuestManager__factory,
  StakedTokenBPT__factory,
  StakedTokenBPT,
  StakedToken,
  StakedToken__factory,
} from '@mstable/protocol/dist/types'
import { providers } from 'ethers'
import { config } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import CollectionReference = firestore.CollectionReference

import { ContractDataSource } from './ContractDataSource'
import { UserDoc, UsersDataSource } from './UsersDataSource'
import { LegacyGovSubgraphDataSource } from './LegacyGovSubgraphDataSource'
import { PolygonProtocolSubgraphDataSource } from './PolygonProtocolSubgraphDataSource'
import { MainnetProtocolSubgraphDataSource } from './MainnetProtocolSubgraphDataSource'

export interface DataSources {
  // Firestores
  users: UsersDataSource

  // Contracts
  questManager: ContractDataSource<QuestManager>
  stakedTokenMTA: ContractDataSource<StakedToken>
  stakedTokenBPT: ContractDataSource<StakedTokenBPT>

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

admin.firestore().settings({ ignoreUndefinedProperties: true })

export const dataSources = (): DataSources => {
  const {
    network,
    infura_key,
    infura_id,
    data_sources: { staked_token_mta_address, staked_token_bpt_address, quest_manager_address },
  } = config().questbook

  const provider = new providers.InfuraProvider(network, { projectId: infura_id, projectSecret: infura_key })

  const stakedTokenMTA = StakedToken__factory.connect(staked_token_mta_address, provider)
  const stakedTokenBPT = StakedTokenBPT__factory.connect(staked_token_bpt_address, provider)
  const questManager = QuestManager__factory.connect(quest_manager_address, provider)

  const firestore = admin.firestore()
  const usersCollection = firestore.collection('users') as CollectionReference<UserDoc>

  return {
    questManager: new ContractDataSource(questManager as never),
    stakedTokenMTA: new ContractDataSource(stakedTokenMTA as never),
    stakedTokenBPT: new ContractDataSource(stakedTokenBPT as never),
    users: new UsersDataSource(usersCollection),
    legacyGovSubgraph: LegacyGovSubgraphDataSource.create(),
    polygonProtocolSubgraph: PolygonProtocolSubgraphDataSource.create(),
    mainnetProtocolSubgraph: MainnetProtocolSubgraphDataSource.create(),
  }
}
