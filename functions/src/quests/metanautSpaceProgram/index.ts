import { QuestObjective, QuestDefinition } from '../types'

import { mintedPolygonMusd } from './mintedPolygonMusd'
import { mintedMainnetMusd } from './mintedMainnetMusd'
import { delegatooor } from './delegatooor'
import { setDial } from './setDial'
import { selfless } from './selfless'
import { imAllIn } from './imAllIn'
import { patOnTheBack } from './patOnTheBack'
import { poaps } from './poaps'
import { gmBossDefeated } from './gmBossDefeated'

const objectives: QuestObjective[] = [
  mintedPolygonMusd, // 5
  mintedMainnetMusd, // 5
  delegatooor, // 2
  setDial, // 4
  imAllIn, // 3
  selfless, // 5
  patOnTheBack, // 2
  poaps, // 20
  gmBossDefeated, // 10
]
// total: 56

export const metanautSpaceProgram: QuestDefinition = {
  id: 'metanautSpaceProgram',
  // ethereumId: 1,
  objectives,
  requiredPoints: 100,
  title: 'Metanaut Space Program',
  description: 'To the moon. Get at least 100 QP to complete this quest. More objectives are coming throughout Season 0.',
}
