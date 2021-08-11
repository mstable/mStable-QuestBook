import { Wallet } from 'ethers'
import { arrayify, solidityKeccak256 } from 'ethers/lib/utils'
import { config } from 'firebase-functions'

import { Resolvers } from '../graphql/types'
import { DataSources } from '../dataSources/types'
import { questsMap } from '../quests'

const signerWallet = Wallet.fromMnemonic(config().questbook.quest_signer_mnemonic)

export const resolvers: Resolvers<{ dataSources: DataSources }> = {
  Query: {
    quest: async (_, { id }) => {
      const quest = questsMap[parseInt(id)]
      if (!quest) return null
      return { id, metadata: quest.metadata }
    },
  },

  Quest: {
    submission: async ({ id }, { account }, { dataSources }) => {
      const questId = parseInt(id)
      const quest = questsMap[questId]
      if (!quest) throw new Error(`Quest ${id} not found`)

      return quest.checker(dataSources, account)
    },
  },

  Mutation: {
    submitQuest: async (_, { id, account }, { dataSources }) => {
      const questId = parseInt(id)
      const quest = questsMap[questId]
      if (!quest) throw new Error(`Quest ${id} not found`)

      const { complete, progress } = await quest.checker(dataSources, account)

      if (!complete) return { complete, progress }

      const messageHash = solidityKeccak256(['address', 'uint256'], [account, questId])
      const signature = await signerWallet.signMessage(arrayify(messageHash))

      return { complete, progress, signature }
    },
  },
}
