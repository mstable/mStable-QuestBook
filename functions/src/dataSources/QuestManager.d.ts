/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from 'ethers'
import { BytesLike } from '@ethersproject/bytes'
import { Listener, Provider } from '@ethersproject/providers'
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi'
import { TypedEventFilter, TypedEvent, TypedListener } from './commons'

interface QuestManagerInterface extends ethers.utils.Interface {
  functions: {
    'addQuest(uint8,uint8,uint32)': FunctionFragment
    'addStakedToken(address)': FunctionFragment
    'balanceData(address)': FunctionFragment
    'checkForSeasonFinish(address)': FunctionFragment
    'completeQuests(address,uint256[],bytes[])': FunctionFragment
    'expireQuest(uint16)': FunctionFragment
    'getQuest(uint256)': FunctionFragment
    'hasCompleted(address,uint256)': FunctionFragment
    'initialize(address,address)': FunctionFragment
    'nexus()': FunctionFragment
    'questMaster()': FunctionFragment
    'seasonEpoch()': FunctionFragment
    'setQuestMaster(address)': FunctionFragment
    'setQuestSigner(address)': FunctionFragment
    'startNewQuestSeason()': FunctionFragment
  }

  encodeFunctionData(functionFragment: 'addQuest', values: [BigNumberish, BigNumberish, BigNumberish]): string
  encodeFunctionData(functionFragment: 'addStakedToken', values: [string]): string
  encodeFunctionData(functionFragment: 'balanceData', values: [string]): string
  encodeFunctionData(functionFragment: 'checkForSeasonFinish', values: [string]): string
  encodeFunctionData(functionFragment: 'completeQuests', values: [string, BigNumberish[], BytesLike[]]): string
  encodeFunctionData(functionFragment: 'expireQuest', values: [BigNumberish]): string
  encodeFunctionData(functionFragment: 'getQuest', values: [BigNumberish]): string
  encodeFunctionData(functionFragment: 'hasCompleted', values: [string, BigNumberish]): string
  encodeFunctionData(functionFragment: 'initialize', values: [string, string]): string
  encodeFunctionData(functionFragment: 'nexus', values?: undefined): string
  encodeFunctionData(functionFragment: 'questMaster', values?: undefined): string
  encodeFunctionData(functionFragment: 'seasonEpoch', values?: undefined): string
  encodeFunctionData(functionFragment: 'setQuestMaster', values: [string]): string
  encodeFunctionData(functionFragment: 'setQuestSigner', values: [string]): string
  encodeFunctionData(functionFragment: 'startNewQuestSeason', values?: undefined): string

  decodeFunctionResult(functionFragment: 'addQuest', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'addStakedToken', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'balanceData', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'checkForSeasonFinish', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'completeQuests', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'expireQuest', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'getQuest', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'hasCompleted', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'nexus', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'questMaster', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'seasonEpoch', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'setQuestMaster', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'setQuestSigner', data: BytesLike): Result
  decodeFunctionResult(functionFragment: 'startNewQuestSeason', data: BytesLike): Result

  events: {
    'QuestAdded(address,uint256,uint8,uint16,uint8,uint32)': EventFragment
    'QuestComplete(address,uint256)': EventFragment
    'QuestExpired(uint16)': EventFragment
    'QuestMaster(address,address)': EventFragment
    'QuestSeasonEnded()': EventFragment
    'QuestSigner(address,address)': EventFragment
    'StakedTokenAdded(address)': EventFragment
  }

  getEvent(nameOrSignatureOrTopic: 'QuestAdded'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'QuestComplete'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'QuestExpired'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'QuestMaster'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'QuestSeasonEnded'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'QuestSigner'): EventFragment
  getEvent(nameOrSignatureOrTopic: 'StakedTokenAdded'): EventFragment
}

export class QuestManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this
  attach(addressOrName: string): this
  deployed(): Promise<this>

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): this

  listeners(eventName?: string): Array<Listener>
  off(eventName: string, listener: Listener): this
  on(eventName: string, listener: Listener): this
  once(eventName: string, listener: Listener): this
  removeListener(eventName: string, listener: Listener): this
  removeAllListeners(eventName?: string): this

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>

  interface: QuestManagerInterface

  functions: {
    addQuest(
      _model: BigNumberish,
      _multiplier: BigNumberish,
      _expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    addStakedToken(_stakedToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    balanceData(
      _account: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [number, number, number] & {
          lastAction: number
          permMultiplier: number
          seasonMultiplier: number
        },
      ]
    >

    checkForSeasonFinish(_account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    completeQuests(
      _account: string,
      _ids: BigNumberish[],
      _signatures: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    expireQuest(_id: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    getQuest(
      _id: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [
        [number, number, number, number] & {
          model: number
          multiplier: number
          status: number
          expiry: number
        },
      ]
    >

    hasCompleted(_account: string, _id: BigNumberish, overrides?: CallOverrides): Promise<[boolean]>

    initialize(
      _questMaster: string,
      _questSignerArg: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>

    nexus(overrides?: CallOverrides): Promise<[string]>

    questMaster(overrides?: CallOverrides): Promise<[string]>

    seasonEpoch(overrides?: CallOverrides): Promise<[number]>

    setQuestMaster(_newQuestMaster: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    setQuestSigner(_newQuestSigner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

    startNewQuestSeason(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>
  }

  addQuest(
    _model: BigNumberish,
    _multiplier: BigNumberish,
    _expiry: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  addStakedToken(_stakedToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  balanceData(
    _account: string,
    overrides?: CallOverrides,
  ): Promise<
    [number, number, number] & {
      lastAction: number
      permMultiplier: number
      seasonMultiplier: number
    }
  >

  checkForSeasonFinish(_account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  completeQuests(
    _account: string,
    _ids: BigNumberish[],
    _signatures: BytesLike[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  expireQuest(_id: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  getQuest(
    _id: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<
    [number, number, number, number] & {
      model: number
      multiplier: number
      status: number
      expiry: number
    }
  >

  hasCompleted(_account: string, _id: BigNumberish, overrides?: CallOverrides): Promise<boolean>

  initialize(
    _questMaster: string,
    _questSignerArg: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>

  nexus(overrides?: CallOverrides): Promise<string>

  questMaster(overrides?: CallOverrides): Promise<string>

  seasonEpoch(overrides?: CallOverrides): Promise<number>

  setQuestMaster(_newQuestMaster: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  setQuestSigner(_newQuestSigner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  startNewQuestSeason(overrides?: Overrides & { from?: string | Promise<string> }): Promise<ContractTransaction>

  callStatic: {
    addQuest(_model: BigNumberish, _multiplier: BigNumberish, _expiry: BigNumberish, overrides?: CallOverrides): Promise<void>

    addStakedToken(_stakedToken: string, overrides?: CallOverrides): Promise<void>

    balanceData(
      _account: string,
      overrides?: CallOverrides,
    ): Promise<
      [number, number, number] & {
        lastAction: number
        permMultiplier: number
        seasonMultiplier: number
      }
    >

    checkForSeasonFinish(_account: string, overrides?: CallOverrides): Promise<number>

    completeQuests(_account: string, _ids: BigNumberish[], _signatures: BytesLike[], overrides?: CallOverrides): Promise<void>

    expireQuest(_id: BigNumberish, overrides?: CallOverrides): Promise<void>

    getQuest(
      _id: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<
      [number, number, number, number] & {
        model: number
        multiplier: number
        status: number
        expiry: number
      }
    >

    hasCompleted(_account: string, _id: BigNumberish, overrides?: CallOverrides): Promise<boolean>

    initialize(_questMaster: string, _questSignerArg: string, overrides?: CallOverrides): Promise<void>

    nexus(overrides?: CallOverrides): Promise<string>

    questMaster(overrides?: CallOverrides): Promise<string>

    seasonEpoch(overrides?: CallOverrides): Promise<number>

    setQuestMaster(_newQuestMaster: string, overrides?: CallOverrides): Promise<void>

    setQuestSigner(_newQuestSigner: string, overrides?: CallOverrides): Promise<void>

    startNewQuestSeason(overrides?: CallOverrides): Promise<void>
  }

  filters: {
    QuestAdded(
      questMaster?: null,
      id?: null,
      model?: null,
      multiplier?: null,
      status?: null,
      expiry?: null,
    ): TypedEventFilter<
      [string, BigNumber, number, number, number, number],
      {
        questMaster: string
        id: BigNumber
        model: number
        multiplier: number
        status: number
        expiry: number
      }
    >

    QuestComplete(user?: string | null, id?: BigNumberish | null): TypedEventFilter<[string, BigNumber], { user: string; id: BigNumber }>

    QuestExpired(id?: BigNumberish | null): TypedEventFilter<[number], { id: number }>

    QuestMaster(
      oldQuestMaster?: null,
      newQuestMaster?: null,
    ): TypedEventFilter<[string, string], { oldQuestMaster: string; newQuestMaster: string }>

    QuestSeasonEnded(): TypedEventFilter<[], {}>

    QuestSigner(
      oldQuestSigner?: null,
      newQuestSigner?: null,
    ): TypedEventFilter<[string, string], { oldQuestSigner: string; newQuestSigner: string }>

    StakedTokenAdded(stakedToken?: null): TypedEventFilter<[string], { stakedToken: string }>
  }

  estimateGas: {
    addQuest(
      _model: BigNumberish,
      _multiplier: BigNumberish,
      _expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    addStakedToken(_stakedToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    balanceData(_account: string, overrides?: CallOverrides): Promise<BigNumber>

    checkForSeasonFinish(_account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    completeQuests(
      _account: string,
      _ids: BigNumberish[],
      _signatures: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    expireQuest(_id: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    getQuest(_id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>

    hasCompleted(_account: string, _id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>

    initialize(
      _questMaster: string,
      _questSignerArg: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>

    nexus(overrides?: CallOverrides): Promise<BigNumber>

    questMaster(overrides?: CallOverrides): Promise<BigNumber>

    seasonEpoch(overrides?: CallOverrides): Promise<BigNumber>

    setQuestMaster(_newQuestMaster: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    setQuestSigner(_newQuestSigner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>

    startNewQuestSeason(overrides?: Overrides & { from?: string | Promise<string> }): Promise<BigNumber>
  }

  populateTransaction: {
    addQuest(
      _model: BigNumberish,
      _multiplier: BigNumberish,
      _expiry: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    addStakedToken(_stakedToken: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    balanceData(_account: string, overrides?: CallOverrides): Promise<PopulatedTransaction>

    checkForSeasonFinish(_account: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    completeQuests(
      _account: string,
      _ids: BigNumberish[],
      _signatures: BytesLike[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    expireQuest(_id: BigNumberish, overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    getQuest(_id: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>

    hasCompleted(_account: string, _id: BigNumberish, overrides?: CallOverrides): Promise<PopulatedTransaction>

    initialize(
      _questMaster: string,
      _questSignerArg: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>

    nexus(overrides?: CallOverrides): Promise<PopulatedTransaction>

    questMaster(overrides?: CallOverrides): Promise<PopulatedTransaction>

    seasonEpoch(overrides?: CallOverrides): Promise<PopulatedTransaction>

    setQuestMaster(_newQuestMaster: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    setQuestSigner(_newQuestSigner: string, overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>

    startNewQuestSeason(overrides?: Overrides & { from?: string | Promise<string> }): Promise<PopulatedTransaction>
  }
}
