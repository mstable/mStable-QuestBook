import { DataSources } from '../dataSources'

export interface ObjectiveCompletion {
  complete: boolean
  progress?: number
}

export type ObjectiveChecker = (account: string, dataSources: DataSources) => Promise<ObjectiveCompletion>

export interface QuestObjective {
  id: string
  checker: ObjectiveChecker
  points: number
  title: string
  description: string
}

export interface QuestDefinition {
  id: string
  ethereumId?: number
  objectives: QuestObjective[]
  requiredPoints: number
  title: string
  description: string
  imageURI?: string
}
