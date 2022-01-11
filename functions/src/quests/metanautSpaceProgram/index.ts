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
import { saver } from './saver'
import { saverPolygon } from './saverPolygon'
import { vote } from './vote'
import { enoughVotes } from './enoughVotes'
import { moreThanEnoughVotes } from './moreThanEnoughVotes'
import { poaps1 } from './poaps1'
import { poaps2 } from './poaps2'
import { poaps3 } from './poaps3'
import { theChickenOfDestiny } from './theChickenOfDestiny'

const objectives: QuestObjective[] = [
  mintedPolygonMusd,
  mintedMainnetMusd,
  delegatooor,
  setDial,
  imAllIn,
  selfless,
  patOnTheBack,
  poaps1,
  poaps2,
  poaps3,
  theChickenOfDestiny,
  saver,
  saverPolygon,
  soEarly,
  stillEarly,
  vote,
  enoughVotes,
  moreThanEnoughVotes,
]

export const metanautSpaceProgram: QuestDefinition = {
  id: 'metanautSpaceProgram',
  ethereumId: 2,
  objectives,
  requiredPoints: 100,
  title: 'Metanaut Space Program',
  description: 'To the moon. Get at least 100 QP to complete this quest.',
}
