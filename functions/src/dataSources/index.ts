import { providers } from 'ethers'
import { config } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import CollectionReference = firestore.CollectionReference

import { QuestManager } from '../typechain/QuestManager'
import { QuestManager__factory } from '../typechain/factories/QuestManager__factory'
import { StakedTokenMTA } from '../typechain/StakedTokenMTA'
import { StakedTokenMTA__factory } from '../typechain/factories/StakedTokenMTA__factory'
import { StakedTokenBPT } from '../typechain/StakedTokenBPT'
import { StakedTokenBPT__factory } from '../typechain/factories/StakedTokenBPT__factory'
import { EmissionsController } from '../typechain/EmissionsController'
import { EmissionsController__factory } from '../typechain/factories/EmissionsController__factory'

import { ContractDataSource } from './ContractDataSource'
import { UserDoc, UsersDataSource } from './UsersDataSource'
import { LegacyGovSubgraphDataSource } from './LegacyGovSubgraphDataSource'
import { PolygonProtocolSubgraphDataSource } from './PolygonProtocolSubgraphDataSource'
import { MainnetProtocolSubgraphDataSource } from './MainnetProtocolSubgraphDataSource'
import { PoapDataSource } from './PoapDataSource'
import { SnapshotDataSource } from './SnapshotDataSource'

export interface DataSources {
  // Firestores
  users: UsersDataSource

  // Contracts
  emissionsController: ContractDataSource<EmissionsController>
  questManager: ContractDataSource<QuestManager>
  stakedTokenMTA: ContractDataSource<StakedTokenMTA>
  stakedTokenBPT: ContractDataSource<StakedTokenBPT>

  // Subgraphs
  legacyGovSubgraph: LegacyGovSubgraphDataSource
  polygonProtocolSubgraph: PolygonProtocolSubgraphDataSource
  mainnetProtocolSubgraph: MainnetProtocolSubgraphDataSource
  poaps: PoapDataSource
  snapshot: SnapshotDataSource
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
    data_sources: { staked_token_mta_address, staked_token_bpt_address, quest_manager_address, emissions_controller_address },
  } = config().questbook

  const provider = new providers.InfuraProvider(network, { projectId: infura_id, projectSecret: infura_key })

  const stakedTokenMTA = StakedTokenMTA__factory.connect(staked_token_mta_address, provider)
  const stakedTokenBPT = StakedTokenBPT__factory.connect(staked_token_bpt_address, provider)
  const questManager = QuestManager__factory.connect(quest_manager_address, provider)
  const emissionsController = EmissionsController__factory.connect(emissions_controller_address, provider)

  const firestore = admin.firestore()
  const usersCollection = firestore.collection('users') as CollectionReference<UserDoc>

  return {
    questManager: new ContractDataSource(questManager as never),
    stakedTokenMTA: new ContractDataSource(stakedTokenMTA as never),
    stakedTokenBPT: new ContractDataSource(stakedTokenBPT as never),
    emissionsController: new ContractDataSource(emissionsController as never),
    users: new UsersDataSource(usersCollection),
    legacyGovSubgraph: LegacyGovSubgraphDataSource.create(),
    polygonProtocolSubgraph: PolygonProtocolSubgraphDataSource.create(),
    mainnetProtocolSubgraph: MainnetProtocolSubgraphDataSource.create(),
    poaps: PoapDataSource.create(),
    snapshot: new SnapshotDataSource(),
  }
}
