import { QuestObjective, QuestDefinition } from '../types'

import { mintedPolygonMusd } from './mintedPolygonMusd'
import { mintedMainnetMusd } from './mintedMainnetMusd'
import { delegatooor } from './delegatooor'
import { setDial } from './setDial'
import { selfless } from './selfless'
import { imAllIn } from './imAllIn'
import { patOnTheBack } from './patOnTheBack'

const objectives: QuestObjective[] = [mintedPolygonMusd, mintedMainnetMusd, delegatooor, setDial, imAllIn, selfless, patOnTheBack]

export const metanautSpaceProgram: QuestDefinition = {
  id: 'metanautSpaceProgram',
  // ethereumId: 1,
  objectives,
  requiredPoints: 100,
  title: 'Metanaut Space Program',
  description: 'To the moon. Get at least 100 QP to complete this quest. More objectives are coming throughout Season 0.',
}
