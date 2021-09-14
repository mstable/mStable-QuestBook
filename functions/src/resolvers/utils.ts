import { DefenderRelayProvider, DefenderRelaySigner } from 'defender-relay-client/lib/ethers'
import { arrayify, solidityKeccak256, verifyMessage } from 'ethers/lib/utils'
import { config } from 'firebase-functions'
import { AuthenticationError } from 'apollo-server-cloud-functions'

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

const getRelayCredentials = () => {
  const {
    questbook: {
      defender: { questmaster_secret, questmaster_api_key },
    },
  } = config()

  return {
    apiKey: questmaster_api_key,
    apiSecret: questmaster_secret,
  }
}

export const getDefenderSigner = () => {
  const credentials = getRelayCredentials()
  const provider = new DefenderRelayProvider(credentials)
  return new DefenderRelaySigner(credentials, provider)
}

export const signQuestSubmission = async (id: string, account: string): Promise<string> => {
  const defenderSigner = getDefenderSigner()
  const messageHash = solidityKeccak256(['address', 'uint256'], [account, parseInt(id)])
  return defenderSigner.signMessage(arrayify(messageHash))
}

export const getUnixTime = (time: number) => Math.floor(time / 1e3)
