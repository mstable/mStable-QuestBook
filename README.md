# mStable QuestBook

GraphQL API for checking and signing mStable Quests

## Quickstart

1. [Install Firebase tools](https://firebase.google.com/docs/cli#install_the_firebase_cli)

2. Firebase login
```shell
firebase login
```

3. Set project (optional)
```shell
firebase use ropsten
```

4. Go to functions module
```shell
cd functions
```

5. Get environment variables locally

```shell
firebase functions:config:get > .runtimeconfig.json
```

5. Install, then build and run with emulators

```shell
yarn
yarn serve
```

## Deployment

```shell
# From the root of the projecet
firebase use production
firebase deploy
```

## Environment variables

See the [Firebase documentation](https://firebase.google.com/docs/functions/config-env) for instructions on how to set the config.

## API

```graphql
query Quest($id: ID!, $account: ID!) {
    quest(id: $id) {
        id
        metadata {
            title
            description
        }
        submission(account: $account) {
            complete
            progress
            signature
        }
    }
}

mutation Submit($id: ID! $account: ID!) {
    submitQuest(id: $id, account: $account) {
        complete
        progress
        signature
    }
}
```

## Defining quests

Quests are defined programmatically; to add a new quest, copy an example and create a PR.

Quests need to have unique IDs; the numeric ID of the quest on-chain.

See `src/quests/certifiedWhale.ts` for an example.


## Data sources

Quest checker functions have access to the data sources that the Apollo server uses. These can be used like so:

```typescript
const certifiedWhale: QuestChecker = async (dataSources, account) => {
  const balance = await dataSources.stakedToken.contract.balanceOf(account)
  // ...do something with the balance
}
```

Data sources can be added as-needed; just extend Apollo's `DataSource` class (or find an existing implentation) and add them to the Apollo server's `dataSources` prop.
