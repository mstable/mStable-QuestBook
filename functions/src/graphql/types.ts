import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly updateQuest: Scalars['Boolean'];
  readonly updateQuests: Scalars['Boolean'];
};


export type MutationUpdateQuestArgs = {
  userId: Scalars['ID'];
  questId: Scalars['ID'];
};


export type MutationUpdateQuestsArgs = {
  userId: Scalars['ID'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly quests: ReadonlyArray<Quest>;
};


export type QueryQuestsArgs = {
  userId?: Maybe<Scalars['ID']>;
};

export type Quest = {
  readonly __typename?: 'Quest';
  readonly id: Scalars['ID'];
  readonly ethereumId?: Maybe<Scalars['Int']>;
  readonly objectives: ReadonlyArray<QuestObjective>;
  readonly title: Scalars['String'];
  readonly description: Scalars['String'];
  readonly imageURI?: Maybe<Scalars['String']>;
  readonly userQuest?: Maybe<UserQuest>;
};


export type QuestUserQuestArgs = {
  userId: Scalars['ID'];
};

export type QuestObjective = {
  readonly __typename?: 'QuestObjective';
  readonly id: Scalars['ID'];
  readonly points: Scalars['Int'];
  readonly title: Scalars['String'];
  readonly description: Scalars['String'];
};

export type UserQuest = {
  readonly __typename?: 'UserQuest';
  readonly id: Scalars['ID'];
  readonly complete: Scalars['Boolean'];
  readonly progress?: Maybe<Scalars['Float']>;
  readonly signature?: Maybe<Scalars['String']>;
  readonly objectives?: Maybe<ReadonlyArray<UserQuestObjective>>;
};

export type UserQuestObjective = {
  readonly __typename?: 'UserQuestObjective';
  readonly id: Scalars['ID'];
  readonly complete: Scalars['Boolean'];
  readonly progress?: Maybe<Scalars['Float']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Query: ResolverTypeWrapper<{}>;
  Quest: ResolverTypeWrapper<Quest>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  QuestObjective: ResolverTypeWrapper<QuestObjective>;
  UserQuest: ResolverTypeWrapper<UserQuest>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  UserQuestObjective: ResolverTypeWrapper<UserQuestObjective>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Mutation: {};
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  Query: {};
  Quest: Quest;
  Int: Scalars['Int'];
  String: Scalars['String'];
  QuestObjective: QuestObjective;
  UserQuest: UserQuest;
  Float: Scalars['Float'];
  UserQuestObjective: UserQuestObjective;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  updateQuest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateQuestArgs, 'userId' | 'questId'>>;
  updateQuests?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationUpdateQuestsArgs, 'userId'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  quests?: Resolver<ReadonlyArray<ResolversTypes['Quest']>, ParentType, ContextType, RequireFields<QueryQuestsArgs, never>>;
}>;

export type QuestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quest'] = ResolversParentTypes['Quest']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ethereumId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  objectives?: Resolver<ReadonlyArray<ResolversTypes['QuestObjective']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userQuest?: Resolver<Maybe<ResolversTypes['UserQuest']>, ParentType, ContextType, RequireFields<QuestUserQuestArgs, 'userId'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuestObjectiveResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestObjective'] = ResolversParentTypes['QuestObjective']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserQuestResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserQuest'] = ResolversParentTypes['UserQuest']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  signature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  objectives?: Resolver<Maybe<ReadonlyArray<ResolversTypes['UserQuestObjective']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserQuestObjectiveResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserQuestObjective'] = ResolversParentTypes['UserQuestObjective']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quest?: QuestResolvers<ContextType>;
  QuestObjective?: QuestObjectiveResolvers<ContextType>;
  UserQuest?: UserQuestResolvers<ContextType>;
  UserQuestObjective?: UserQuestObjectiveResolvers<ContextType>;
}>;

