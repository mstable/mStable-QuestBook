import { DataSources } from '../dataSources/types'

export type QuestCompletion = { complete: boolean; progress?: number }

export type QuestChecker = (dataSources: DataSources, account: string) => Promise<QuestCompletion>

export type QuestDefinitions = { [id: number]: { checker: QuestChecker; metadata: { title: string; description: string } } }
