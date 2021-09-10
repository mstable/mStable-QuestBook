import { QuestDefinition } from './types'

import { theGreatMigration } from './theGreatMigration'
import { metanautSpaceProgram } from './metanautSpaceProgram'
import { stakeTime } from './stakeTime'
import { whale } from './whale'

export const QUESTS: readonly QuestDefinition[] = [theGreatMigration, metanautSpaceProgram, stakeTime, whale] as const

// Runtime sanity check
QUESTS.forEach((def, idx, arr) => {
  if (arr.find((_def, _idx) => typeof _def.ethereumId === 'number' && _idx !== idx && _def.ethereumId === def.ethereumId)) {
    throw new Error(`Duplicate quest Ethereum ID ${def.ethereumId}`)
  }
})
