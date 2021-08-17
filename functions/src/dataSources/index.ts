import { StakedToken__factory } from './StakedToken__factory' // TODO replace with @mstable/protocol
import { providers } from 'ethers'
import { config } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import CollectionReference = firestore.CollectionReference

import { DataSources } from './types'
import { ContractDataSource } from './ContractDataSource'
import { UserDoc, UsersDataSource } from './UsersDataSource'
import { MetadataDataSource, MetadataDoc } from './MetadataDataSource'

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
    data_sources: { staked_token_address },
  } = config().questbook

  const provider = new providers.InfuraProvider(network, { projectId: infura_id, projectSecret: infura_key })

  const stakedToken = StakedToken__factory.connect(staked_token_address, provider)

  // TODO add more contract sources
  // TODO add subgraph sources

  const firestore = admin.firestore()
  const usersCollection = firestore.collection('users') as CollectionReference<UserDoc>
  const metadataCollection = firestore.collection('metadata') as CollectionReference<MetadataDoc>

  return {
    stakedToken: new ContractDataSource(stakedToken as never),
    users: new UsersDataSource(usersCollection),
    metadata: new MetadataDataSource(metadataCollection),
  }
}
