import { QuestObjective, QuestDefinition } from '../types'

import { mintedPolygonMusd } from './mintedPolygonMusd'
import { mintedMainnetMusd } from './mintedMainnetMusd'
import { delegatooor } from './delegatooor'
import { setDial } from './setDial'
import { selfless } from './selfless'
import { imAllIn } from './imAllIn'
import { patOnTheBack } from './patOnTheBack'
import { soEarly } from './soEarly'
import { stillEarly } from './stillEarly'
import { saved } from './saved'
import { vote } from './vote'
import { enoughVotes } from './enoughVotes'
import { moreThanEnoughVotes } from './moreThanEnoughVotes'
import { poaps1 } from './poaps1'
import { poaps2 } from './poaps2'
import { poaps3 } from './poaps3'
import { theChickenOfDestiny } from './theChickenOfDestiny'

const objectives: QuestObjective[] = [
  mintedPolygonMusd, // 5
  mintedMainnetMusd, // 5
  delegatooor, // 2
  setDial, // 4
  imAllIn, // 3
  selfless, // 5
  patOnTheBack, // 2
  poaps1, // 10
  poaps2, // 10
  poaps3, // 10
  theChickenOfDestiny, // 5
  saved, // 5
  soEarly, // 50
  stillEarly, // 25
  vote, // 25
  enoughVotes, // 10
  moreThanEnoughVotes, // 25
]
// Total: 201 (required: 100)

export const metanautSpaceProgram: QuestDefinition = {
  id: 'metanautSpaceProgram',
  ethereumId: 1,
  objectives,
  requiredPoints: 100,
  title: 'Metanaut Space Program',
  description: 'To the moon. Get at least 100 QP to complete this quest. More objectives are coming throughout Season 0.',
}
