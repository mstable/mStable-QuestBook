import { QuestObjective, QuestDefinition, ObjectiveChecker } from '../types'
import { getUnixTime } from '../../resolvers/utils'

const createHodlChecker =
  (objectiveIdx: number, requiredHodlLength: number): ObjectiveChecker =>
  async (account, dataSources) => {
    const user = await dataSources.users.getOrCreate(account)
    const userObjectives = user.quests.find((q) => q.questId === stakeTime.id)?.objectives ?? []

    // If the user completed the next objectives, they've done this one
    const next = userObjectives.filter((_, idx) => idx > objectiveIdx)
    if (next.length > 0) {
      return {
        complete: true,
        progress: 1,
      }
    }

    const now = getUnixTime(Date.now())

    const { weightedTimestamp } = await dataSources.stakedToken.contract.balanceData(account)

    const hodlLength = Math.max(0, now - weightedTimestamp)
    const complete = hodlLength >= requiredHodlLength
    const progress = Math.max(0, Math.min(1, hodlLength / requiredHodlLength))

    return {
      complete,
      progress,
    }
  }

const weeksToSeconds = (weeks: number) => weeks * 7 * 24 * 60

const staked3Months: QuestObjective = {
  id: 'staked3Months',
  title: 'Staked for 3 months',
  description: 'Look at you go',
  points: 20,
  checker: createHodlChecker(0, weeksToSeconds(13)),
}

const staked6Months: QuestObjective = {
  id: 'staked6Months',
  title: 'Staked for 6 months',
  description: 'Look at you go',
  points: 20,
  checker: createHodlChecker(1, weeksToSeconds(26)),
}

const staked12Months: QuestObjective = {
  id: 'staked12Months',
  title: 'Staked for 12 months',
  description: 'Look at you go',
  points: 20,
  checker: createHodlChecker(2, weeksToSeconds(52)),
}

const staked18Months: QuestObjective = {
  id: 'staked18Months',
  title: 'Staked for 18 months',
  description: 'Look at you go',
  points: 20,
  checker: createHodlChecker(3, weeksToSeconds(78)),
}

const staked24Months: QuestObjective = {
  id: 'staked24Months',
  title: 'Staked for 24 months',
  description: 'Look at you go',
  points: 20,
  checker: createHodlChecker(4, weeksToSeconds(104)),
}

export const stakeTime: QuestDefinition = {
  id: 'stakeTime',
  objectives: [staked3Months, staked6Months, staked12Months, staked18Months, staked24Months],
  requiredPoints: 100,
  title: 'Stake time',
  description: 'Time multiplier for staking',
}
