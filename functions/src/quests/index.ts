import { QuestChecker, QuestDefinition, QuestDefinitions } from './types'

import certifiedWhale from './0.certifiedWhale'
import humbleMinnow from './1.humbleMinnow'

const quests = [
  certifiedWhale,
  humbleMinnow,
  // Add quests here ^
] as Array<[number, QuestChecker]>

// Runtime sanity check
quests.forEach(([id], idx, arr) => {
  if (arr.find(([_id], _idx) => _idx !== idx && _id === id)) {
    throw new Error(`Duplicate quest checker ID ${id}`)
  }
})

export const questsMap = quests.reduce<QuestDefinitions>((prev, [id, checker]) => ({ ...prev, [id]: { id: id.toString(), checker } }), {})

export const isQuestDefined = (questId: string) => Object.prototype.hasOwnProperty.call(questsMap, parseInt(questId))

export const getQuestDefinition = (questId: string): QuestDefinition => {
  const quest = questsMap[parseInt(questId)]
  if (!quest) {
    throw new Error(`Quest ID ${questId} not found`)
  }
  return quest
}
