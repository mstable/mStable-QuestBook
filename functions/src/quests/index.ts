import { QuestChecker, QuestDefinitions } from './types'

import certifiedWhale from './certifiedWhale'

const quests = [
  certifiedWhale,
  // Add quests here ^
] as Array<[number, QuestChecker, { title: string; description: string }]>

// Runtime sanity check
quests.forEach(([id], idx, arr) => {
  if (arr.find(([_id], _idx) => _idx !== idx && _id === id)) {
    throw new Error(`Duplicate quest checker ID ${id}`)
  }
})

export const questsMap = quests.reduce<QuestDefinitions>((prev, [id, checker, metadata]) => ({ ...prev, [id]: { checker, metadata } }), {})
