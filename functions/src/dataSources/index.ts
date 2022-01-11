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
import { Masset } from '../typechain/Masset'
import { Masset__factory } from '../typechain/factories/Masset__factory'
import { BoostedSavingsVault } from '../typechain/BoostedSavingsVault'
import { BoostedSavingsVault__factory } from '../typechain/factories/BoostedSavingsVault__factory'
import { SavingsContract } from '../typechain/SavingsContract'
import { SavingsContract__factory } from '../typechain/factories/SavingsContract__factory'
import { FraxCrossChainFarm__factory } from '../typechain/factories/FraxCrossChainFarm__factory'
import { FraxCrossChainFarm } from '../typechain/FraxCrossChainFarm'

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

  musd: ContractDataSource<Masset>
  imusd: ContractDataSource<SavingsContract>
  imusdVault: ContractDataSource<BoostedSavingsVault>

  musdPolygon: ContractDataSource<Masset>
  imusdPolygon: ContractDataSource<SavingsContract>
  imusdVaultPolygon: ContractDataSource<BoostedSavingsVault>
  imusdFraxVaultPolygon: ContractDataSource<FraxCrossChainFarm>

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
    matic_endpoint,
    data_sources: {
      staked_token_mta_address,
      staked_token_bpt_address,
      quest_manager_address,
      emissions_controller_address,
      musd_address,
      imusd_address,
      imusd_vault_address,
      musd_address_polygon,
      imusd_address_polygon,
      imusd_vault_address_polygon,
      imusd_frax_vault_address_polygon,
    },
  } = config().questbook

  const provider = new providers.InfuraProvider(network, { projectId: infura_id, projectSecret: infura_key })
  const polygonProvider = new providers.JsonRpcProvider(matic_endpoint)

  const stakedTokenMTA = StakedTokenMTA__factory.connect(staked_token_mta_address, provider)
  const stakedTokenBPT = StakedTokenBPT__factory.connect(staked_token_bpt_address, provider)
  const questManager = QuestManager__factory.connect(quest_manager_address, provider)
  const emissionsController = EmissionsController__factory.connect(emissions_controller_address, provider)
  const musd = Masset__factory.connect(musd_address, provider)
  const imusd = SavingsContract__factory.connect(imusd_address, provider)
  const imusdVault = BoostedSavingsVault__factory.connect(imusd_vault_address, provider)
  const musdPolygon = Masset__factory.connect(musd_address_polygon, polygonProvider)
  const imusdPolygon = SavingsContract__factory.connect(imusd_address_polygon, polygonProvider)
  const imusdVaultPolygon = BoostedSavingsVault__factory.connect(imusd_vault_address_polygon, polygonProvider)
  const imusdFraxVaultPolygon = FraxCrossChainFarm__factory.connect(imusd_frax_vault_address_polygon, polygonProvider)

  const firestore = admin.firestore()
  const usersCollection = firestore.collection('users') as CollectionReference<UserDoc>

  return {
    questManager: new ContractDataSource<QuestManager>(questManager),
    stakedTokenMTA: new ContractDataSource<StakedTokenMTA>(stakedTokenMTA),
    stakedTokenBPT: new ContractDataSource<StakedTokenBPT>(stakedTokenBPT),
    emissionsController: new ContractDataSource<EmissionsController>(emissionsController),
    musd: new ContractDataSource<Masset>(musd),
    imusd: new ContractDataSource<SavingsContract>(imusd),
    imusdVault: new ContractDataSource<BoostedSavingsVault>(imusdVault),
    musdPolygon: new ContractDataSource<Masset>(musdPolygon),
    imusdPolygon: new ContractDataSource<SavingsContract>(imusdPolygon),
    imusdVaultPolygon: new ContractDataSource<BoostedSavingsVault>(imusdVaultPolygon),
    imusdFraxVaultPolygon: new ContractDataSource<FraxCrossChainFarm>(imusdFraxVaultPolygon),
    users: new UsersDataSource(usersCollection),
    legacyGovSubgraph: LegacyGovSubgraphDataSource.create(),
    polygonProtocolSubgraph: PolygonProtocolSubgraphDataSource.create(),
    mainnetProtocolSubgraph: MainnetProtocolSubgraphDataSource.create(),
    poaps: PoapDataSource.create(),
    snapshot: new SnapshotDataSource(),
  }
}
