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
  readonly queueOptIn: Scalars['Boolean'];
  readonly queueOptOut: Scalars['Boolean'];
  readonly setMetadata: Scalars['Boolean'];
};


export type MutationQueueOptInArgs = {
  account: Scalars['ID'];
  signature: Scalars['String'];
};


export type MutationQueueOptOutArgs = {
  account: Scalars['ID'];
  signature: Scalars['String'];
};


export type MutationSetMetadataArgs = {
  json: Scalars['String'];
  signature: Scalars['String'];
};

export type Query = {
  readonly __typename?: 'Query';
  readonly quest?: Maybe<Quest>;
  readonly quests: ReadonlyArray<Maybe<Quest>>;
  readonly user?: Maybe<User>;
  readonly optInQueue: ReadonlyArray<Maybe<User>>;
};


export type QueryQuestArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  account: Scalars['ID'];
};

export type Quest = {
  readonly __typename?: 'Quest';
  readonly id: Scalars['ID'];
  readonly metadata?: Maybe<QuestMetadata>;
  readonly submission?: Maybe<QuestSubmission>;
};


export type QuestSubmissionArgs = {
  account: Scalars['ID'];
};

export type QuestMetadata = {
  readonly __typename?: 'QuestMetadata';
  readonly title: Scalars['String'];
  readonly description: Scalars['String'];
  readonly imageUrl?: Maybe<Scalars['String']>;
};

export type QuestSubmission = {
  readonly __typename?: 'QuestSubmission';
  readonly complete: Scalars['Boolean'];
  readonly progress?: Maybe<Scalars['Float']>;
  readonly signature?: Maybe<Scalars['String']>;
  readonly quest: Quest;
  readonly user?: Maybe<User>;
};

export type User = {
  readonly __typename?: 'User';
  readonly id: Scalars['ID'];
  readonly queueOptIn?: Maybe<Scalars['Boolean']>;
  readonly completed: ReadonlyArray<Maybe<Quest>>;
  readonly queue: ReadonlyArray<Maybe<Quest>>;
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
  String: ResolverTypeWrapper<Scalars['String']>;
  Query: ResolverTypeWrapper<{}>;
  Quest: ResolverTypeWrapper<Quest>;
  QuestMetadata: ResolverTypeWrapper<QuestMetadata>;
  QuestSubmission: ResolverTypeWrapper<QuestSubmission>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Mutation: {};
  Boolean: Scalars['Boolean'];
  ID: Scalars['ID'];
  String: Scalars['String'];
  Query: {};
  Quest: Quest;
  QuestMetadata: QuestMetadata;
  QuestSubmission: QuestSubmission;
  Float: Scalars['Float'];
  User: User;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  queueOptIn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationQueueOptInArgs, 'account' | 'signature'>>;
  queueOptOut?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationQueueOptOutArgs, 'account' | 'signature'>>;
  setMetadata?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSetMetadataArgs, 'json' | 'signature'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  quest?: Resolver<Maybe<ResolversTypes['Quest']>, ParentType, ContextType, RequireFields<QueryQuestArgs, 'id'>>;
  quests?: Resolver<ReadonlyArray<Maybe<ResolversTypes['Quest']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'account'>>;
  optInQueue?: Resolver<ReadonlyArray<Maybe<ResolversTypes['User']>>, ParentType, ContextType>;
}>;

export type QuestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Quest'] = ResolversParentTypes['Quest']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['QuestMetadata']>, ParentType, ContextType>;
  submission?: Resolver<Maybe<ResolversTypes['QuestSubmission']>, ParentType, ContextType, RequireFields<QuestSubmissionArgs, 'account'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuestMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestMetadata'] = ResolversParentTypes['QuestMetadata']> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QuestSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuestSubmission'] = ResolversParentTypes['QuestSubmission']> = ResolversObject<{
  complete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  signature?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quest?: Resolver<ResolversTypes['Quest'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  queueOptIn?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  completed?: Resolver<ReadonlyArray<Maybe<ResolversTypes['Quest']>>, ParentType, ContextType>;
  queue?: Resolver<ReadonlyArray<Maybe<ResolversTypes['Quest']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Quest?: QuestResolvers<ContextType>;
  QuestMetadata?: QuestMetadataResolvers<ContextType>;
  QuestSubmission?: QuestSubmissionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

