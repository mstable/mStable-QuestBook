import { arrayify, solidityKeccak256, verifyMessage } from 'ethers/lib/utils'
import { AuthenticationError } from 'apollo-server-cloud-functions'
import defer from 'defer-promise'
import { config, logger } from 'firebase-functions'
import { Wallet } from 'ethers'

const signerWallet = new Wallet(config().questbook.quest_signer_private_key)

export const signQuestSubmission = async (id: string, account: string): Promise<string> => {
  const messageHash = solidityKeccak256(['address', 'uint256'], [account, parseInt(id)])
  return signerWallet.signMessage(arrayify(messageHash))
}

export const verifySigningAddress = (message: string, address: string, signature: string): boolean => {
  let signingAddress

  try {
    signingAddress = verifyMessage(message, signature)
  } catch (error) {
    throw new AuthenticationError(`Invalid signature: ${error.message}`)
  }

  if (signingAddress.toLowerCase() !== address.toLowerCase()) {
    throw new AuthenticationError(`Invalid signature: expected signed message from ${address}, got ${signingAddress}`)
  }

  return true
}

export const deferUpdate = (promise: Promise<unknown>) => {
  const deferred = defer<void>()
  promise
    .then(() => {
      deferred.resolve()
    })
    .catch((error) => {
      logger.warn(error)
      deferred.resolve()
    })
}
