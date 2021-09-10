import { QuestObjective, QuestDefinition } from '../types'

import { mintedPolygonMusd } from './mintedPolygonMusd'
import { mintedMainnetMusd } from './mintedMainnetMusd'

const objectives: QuestObjective[] = [mintedPolygonMusd, mintedMainnetMusd]

export const metanautSpaceProgram: QuestDefinition = {
  id: 'metanautSpaceProgram',
  ethereumId: 1,
  objectives,
  requiredPoints: 100,
  title: 'Metanaut Space Program',
  description: 'To the moon. Get at least 100 QP to complete this quest.',
}
