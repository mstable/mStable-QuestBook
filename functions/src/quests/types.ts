import { DataSources } from '../dataSources/types'

export type QuestCompletion = { complete: boolean; progress?: number }

export type QuestChecker = (dataSources: DataSources, account: string) => Promise<QuestCompletion>

export interface QuestDefinition {
  id: string
  checker: QuestChecker
}

export type QuestDefinitions = { [id: number]: QuestDefinition }
