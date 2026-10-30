# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListMyPortfolios*](#listmyportfolios)
  - [*GetStock*](#getstock)
  - [*ListStocks*](#liststocks)
  - [*GetHolding*](#getholding)
  - [*ListTransactions*](#listtransactions)
  - [*GetWatchlist*](#getwatchlist)
- [**Mutations**](#mutations)
  - [*InsertUser*](#insertuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreatePortfolio*](#createportfolio)
  - [*UpdatePortfolio*](#updateportfolio)
  - [*DeletePortfolio*](#deleteportfolio)
  - [*InsertStock*](#insertstock)
  - [*UpdateStockPrice*](#updatestockprice)
  - [*DeleteStock*](#deletestock)
  - [*AddHolding*](#addholding)
  - [*UpdateHolding*](#updateholding)
  - [*DeleteHolding*](#deleteholding)
  - [*CreateTransaction*](#createtransaction)
  - [*DeleteTransaction*](#deletetransaction)
  - [*AddToWatchlist*](#addtowatchlist)
  - [*RemoveFromWatchlist*](#removefromwatchlist)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    createdAt: TimestampString;
  };
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListMyPortfolios
You can execute the `ListMyPortfolios` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyPortfolios(options?: ExecuteQueryOptions): QueryPromise<ListMyPortfoliosData, undefined>;

interface ListMyPortfoliosRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPortfoliosData, undefined>;
}
export const listMyPortfoliosRef: ListMyPortfoliosRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyPortfolios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPortfoliosData, undefined>;

interface ListMyPortfoliosRef {
  ...
  (dc: DataConnect): QueryRef<ListMyPortfoliosData, undefined>;
}
export const listMyPortfoliosRef: ListMyPortfoliosRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyPortfoliosRef:
```typescript
const name = listMyPortfoliosRef.operationName;
console.log(name);
```

### Variables
The `ListMyPortfolios` query has no variables.
### Return Type
Recall that executing the `ListMyPortfolios` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyPortfoliosData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyPortfoliosData {
  portfolios: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Portfolio_Key)[];
}
```
### Using `ListMyPortfolios`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyPortfolios } from '@dataconnect/generated';


// Call the `listMyPortfolios()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyPortfolios();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyPortfolios(dataConnect);

console.log(data.portfolios);

// Or, you can use the `Promise` API.
listMyPortfolios().then((response) => {
  const data = response.data;
  console.log(data.portfolios);
});
```

### Using `ListMyPortfolios`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyPortfoliosRef } from '@dataconnect/generated';


// Call the `listMyPortfoliosRef()` function to get a reference to the query.
const ref = listMyPortfoliosRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyPortfoliosRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.portfolios);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolios);
});
```

## GetStock
You can execute the `GetStock` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getStock(vars: GetStockVariables, options?: ExecuteQueryOptions): QueryPromise<GetStockData, GetStockVariables>;

interface GetStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStockVariables): QueryRef<GetStockData, GetStockVariables>;
}
export const getStockRef: GetStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getStock(dc: DataConnect, vars: GetStockVariables, options?: ExecuteQueryOptions): QueryPromise<GetStockData, GetStockVariables>;

interface GetStockRef {
  ...
  (dc: DataConnect, vars: GetStockVariables): QueryRef<GetStockData, GetStockVariables>;
}
export const getStockRef: GetStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getStockRef:
```typescript
const name = getStockRef.operationName;
console.log(name);
```

### Variables
The `GetStock` query requires an argument of type `GetStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetStockVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetStock` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetStockData {
  stock?: {
    tickerSymbol: string;
    companyName: string;
    currentPrice?: number | null;
  };
}
```
### Using `GetStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getStock, GetStockVariables } from '@dataconnect/generated';

// The `GetStock` query requires an argument of type `GetStockVariables`:
const getStockVars: GetStockVariables = {
  id: ..., 
};

// Call the `getStock()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getStock(getStockVars);
// Variables can be defined inline as well.
const { data } = await getStock({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getStock(dataConnect, getStockVars);

console.log(data.stock);

// Or, you can use the `Promise` API.
getStock(getStockVars).then((response) => {
  const data = response.data;
  console.log(data.stock);
});
```

### Using `GetStock`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getStockRef, GetStockVariables } from '@dataconnect/generated';

// The `GetStock` query requires an argument of type `GetStockVariables`:
const getStockVars: GetStockVariables = {
  id: ..., 
};

// Call the `getStockRef()` function to get a reference to the query.
const ref = getStockRef(getStockVars);
// Variables can be defined inline as well.
const ref = getStockRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getStockRef(dataConnect, getStockVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.stock);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.stock);
});
```

## ListStocks
You can execute the `ListStocks` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listStocks(options?: ExecuteQueryOptions): QueryPromise<ListStocksData, undefined>;

interface ListStocksRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStocksData, undefined>;
}
export const listStocksRef: ListStocksRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listStocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStocksData, undefined>;

interface ListStocksRef {
  ...
  (dc: DataConnect): QueryRef<ListStocksData, undefined>;
}
export const listStocksRef: ListStocksRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listStocksRef:
```typescript
const name = listStocksRef.operationName;
console.log(name);
```

### Variables
The `ListStocks` query has no variables.
### Return Type
Recall that executing the `ListStocks` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListStocksData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListStocksData {
  stocks: ({
    tickerSymbol: string;
    companyName: string;
    currentPrice?: number | null;
  })[];
}
```
### Using `ListStocks`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listStocks } from '@dataconnect/generated';


// Call the `listStocks()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listStocks();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listStocks(dataConnect);

console.log(data.stocks);

// Or, you can use the `Promise` API.
listStocks().then((response) => {
  const data = response.data;
  console.log(data.stocks);
});
```

### Using `ListStocks`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listStocksRef } from '@dataconnect/generated';


// Call the `listStocksRef()` function to get a reference to the query.
const ref = listStocksRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listStocksRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.stocks);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.stocks);
});
```

## GetHolding
You can execute the `GetHolding` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getHolding(vars: GetHoldingVariables, options?: ExecuteQueryOptions): QueryPromise<GetHoldingData, GetHoldingVariables>;

interface GetHoldingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetHoldingVariables): QueryRef<GetHoldingData, GetHoldingVariables>;
}
export const getHoldingRef: GetHoldingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getHolding(dc: DataConnect, vars: GetHoldingVariables, options?: ExecuteQueryOptions): QueryPromise<GetHoldingData, GetHoldingVariables>;

interface GetHoldingRef {
  ...
  (dc: DataConnect, vars: GetHoldingVariables): QueryRef<GetHoldingData, GetHoldingVariables>;
}
export const getHoldingRef: GetHoldingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getHoldingRef:
```typescript
const name = getHoldingRef.operationName;
console.log(name);
```

### Variables
The `GetHolding` query requires an argument of type `GetHoldingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetHoldingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetHolding` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetHoldingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetHoldingData {
  holding?: {
    quantity: number;
    averageCost: number;
    notes?: string | null;
    stock: {
      tickerSymbol: string;
    };
  };
}
```
### Using `GetHolding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getHolding, GetHoldingVariables } from '@dataconnect/generated';

// The `GetHolding` query requires an argument of type `GetHoldingVariables`:
const getHoldingVars: GetHoldingVariables = {
  id: ..., 
};

// Call the `getHolding()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getHolding(getHoldingVars);
// Variables can be defined inline as well.
const { data } = await getHolding({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getHolding(dataConnect, getHoldingVars);

console.log(data.holding);

// Or, you can use the `Promise` API.
getHolding(getHoldingVars).then((response) => {
  const data = response.data;
  console.log(data.holding);
});
```

### Using `GetHolding`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getHoldingRef, GetHoldingVariables } from '@dataconnect/generated';

// The `GetHolding` query requires an argument of type `GetHoldingVariables`:
const getHoldingVars: GetHoldingVariables = {
  id: ..., 
};

// Call the `getHoldingRef()` function to get a reference to the query.
const ref = getHoldingRef(getHoldingVars);
// Variables can be defined inline as well.
const ref = getHoldingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getHoldingRef(dataConnect, getHoldingVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.holding);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.holding);
});
```

## ListTransactions
You can execute the `ListTransactions` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTransactions(vars: ListTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface ListTransactionsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
}
export const listTransactionsRef: ListTransactionsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTransactions(dc: DataConnect, vars: ListTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface ListTransactionsRef {
  ...
  (dc: DataConnect, vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
}
export const listTransactionsRef: ListTransactionsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTransactionsRef:
```typescript
const name = listTransactionsRef.operationName;
console.log(name);
```

### Variables
The `ListTransactions` query requires an argument of type `ListTransactionsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListTransactionsVariables {
  holdingId: UUIDString;
}
```
### Return Type
Recall that executing the `ListTransactions` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTransactionsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTransactionsData {
  transactions: ({
    type: string;
    quantity: number;
    pricePerShare: number;
    timestamp: TimestampString;
  })[];
}
```
### Using `ListTransactions`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTransactions, ListTransactionsVariables } from '@dataconnect/generated';

// The `ListTransactions` query requires an argument of type `ListTransactionsVariables`:
const listTransactionsVars: ListTransactionsVariables = {
  holdingId: ..., 
};

// Call the `listTransactions()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTransactions(listTransactionsVars);
// Variables can be defined inline as well.
const { data } = await listTransactions({ holdingId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTransactions(dataConnect, listTransactionsVars);

console.log(data.transactions);

// Or, you can use the `Promise` API.
listTransactions(listTransactionsVars).then((response) => {
  const data = response.data;
  console.log(data.transactions);
});
```

### Using `ListTransactions`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTransactionsRef, ListTransactionsVariables } from '@dataconnect/generated';

// The `ListTransactions` query requires an argument of type `ListTransactionsVariables`:
const listTransactionsVars: ListTransactionsVariables = {
  holdingId: ..., 
};

// Call the `listTransactionsRef()` function to get a reference to the query.
const ref = listTransactionsRef(listTransactionsVars);
// Variables can be defined inline as well.
const ref = listTransactionsRef({ holdingId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTransactionsRef(dataConnect, listTransactionsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.transactions);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.transactions);
});
```

## GetWatchlist
You can execute the `GetWatchlist` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getWatchlist(options?: ExecuteQueryOptions): QueryPromise<GetWatchlistData, undefined>;

interface GetWatchlistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetWatchlistData, undefined>;
}
export const getWatchlistRef: GetWatchlistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWatchlist(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetWatchlistData, undefined>;

interface GetWatchlistRef {
  ...
  (dc: DataConnect): QueryRef<GetWatchlistData, undefined>;
}
export const getWatchlistRef: GetWatchlistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWatchlistRef:
```typescript
const name = getWatchlistRef.operationName;
console.log(name);
```

### Variables
The `GetWatchlist` query has no variables.
### Return Type
Recall that executing the `GetWatchlist` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWatchlistData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetWatchlistData {
  watchlistItems: ({
    stock: {
      tickerSymbol: string;
    };
    targetPriceAlert?: number | null;
  })[];
}
```
### Using `GetWatchlist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWatchlist } from '@dataconnect/generated';


// Call the `getWatchlist()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWatchlist();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWatchlist(dataConnect);

console.log(data.watchlistItems);

// Or, you can use the `Promise` API.
getWatchlist().then((response) => {
  const data = response.data;
  console.log(data.watchlistItems);
});
```

### Using `GetWatchlist`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWatchlistRef } from '@dataconnect/generated';


// Call the `getWatchlistRef()` function to get a reference to the query.
const ref = getWatchlistRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWatchlistRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.watchlistItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.watchlistItems);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## InsertUser
You can execute the `InsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
insertUser(vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface InsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
}
export const insertUserRef: InsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertUser(dc: DataConnect, vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface InsertUserRef {
  ...
  (dc: DataConnect, vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
}
export const insertUserRef: InsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertUserRef:
```typescript
const name = insertUserRef.operationName;
console.log(name);
```

### Variables
The `InsertUser` mutation requires an argument of type `InsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertUserVariables {
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}
```
### Return Type
Recall that executing the `InsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertUserData {
  user_insert: User_Key;
}
```
### Using `InsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertUser, InsertUserVariables } from '@dataconnect/generated';

// The `InsertUser` mutation requires an argument of type `InsertUserVariables`:
const insertUserVars: InsertUserVariables = {
  email: ..., 
  displayName: ..., // optional
  avatarUrl: ..., // optional
};

// Call the `insertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertUser(insertUserVars);
// Variables can be defined inline as well.
const { data } = await insertUser({ email: ..., displayName: ..., avatarUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertUser(dataConnect, insertUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
insertUser(insertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `InsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertUserRef, InsertUserVariables } from '@dataconnect/generated';

// The `InsertUser` mutation requires an argument of type `InsertUserVariables`:
const insertUserVars: InsertUserVariables = {
  email: ..., 
  displayName: ..., // optional
  avatarUrl: ..., // optional
};

// Call the `insertUserRef()` function to get a reference to the mutation.
const ref = insertUserRef(insertUserVars);
// Variables can be defined inline as well.
const ref = insertUserRef({ email: ..., displayName: ..., avatarUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertUserRef(dataConnect, insertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface UpdateUserRef {
  ...
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserVariables {
  displayName?: string | null;
  avatarUrl?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  displayName: ..., // optional
  avatarUrl: ..., // optional
};

// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser(updateUserVars);
// Variables can be defined inline as well.
const { data } = await updateUser({ displayName: ..., avatarUrl: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect, updateUserVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser(updateUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef, UpdateUserVariables } from '@dataconnect/generated';

// The `UpdateUser` mutation has an optional argument of type `UpdateUserVariables`:
const updateUserVars: UpdateUserVariables = {
  displayName: ..., // optional
  avatarUrl: ..., // optional
};

// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef(updateUserVars);
// Variables can be defined inline as well.
const ref = updateUserRef({ displayName: ..., avatarUrl: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserVariables` argument.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect, updateUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreatePortfolio
You can execute the `CreatePortfolio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPortfolio(vars: CreatePortfolioVariables): MutationPromise<CreatePortfolioData, CreatePortfolioVariables>;

interface CreatePortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePortfolioVariables): MutationRef<CreatePortfolioData, CreatePortfolioVariables>;
}
export const createPortfolioRef: CreatePortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPortfolio(dc: DataConnect, vars: CreatePortfolioVariables): MutationPromise<CreatePortfolioData, CreatePortfolioVariables>;

interface CreatePortfolioRef {
  ...
  (dc: DataConnect, vars: CreatePortfolioVariables): MutationRef<CreatePortfolioData, CreatePortfolioVariables>;
}
export const createPortfolioRef: CreatePortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPortfolioRef:
```typescript
const name = createPortfolioRef.operationName;
console.log(name);
```

### Variables
The `CreatePortfolio` mutation requires an argument of type `CreatePortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePortfolioVariables {
  name: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreatePortfolio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePortfolioData {
  portfolio_insert: Portfolio_Key;
}
```
### Using `CreatePortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPortfolio, CreatePortfolioVariables } from '@dataconnect/generated';

// The `CreatePortfolio` mutation requires an argument of type `CreatePortfolioVariables`:
const createPortfolioVars: CreatePortfolioVariables = {
  name: ..., 
  description: ..., // optional
};

// Call the `createPortfolio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPortfolio(createPortfolioVars);
// Variables can be defined inline as well.
const { data } = await createPortfolio({ name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPortfolio(dataConnect, createPortfolioVars);

console.log(data.portfolio_insert);

// Or, you can use the `Promise` API.
createPortfolio(createPortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.portfolio_insert);
});
```

### Using `CreatePortfolio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPortfolioRef, CreatePortfolioVariables } from '@dataconnect/generated';

// The `CreatePortfolio` mutation requires an argument of type `CreatePortfolioVariables`:
const createPortfolioVars: CreatePortfolioVariables = {
  name: ..., 
  description: ..., // optional
};

// Call the `createPortfolioRef()` function to get a reference to the mutation.
const ref = createPortfolioRef(createPortfolioVars);
// Variables can be defined inline as well.
const ref = createPortfolioRef({ name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPortfolioRef(dataConnect, createPortfolioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.portfolio_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolio_insert);
});
```

## UpdatePortfolio
You can execute the `UpdatePortfolio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePortfolio(vars: UpdatePortfolioVariables): MutationPromise<UpdatePortfolioData, UpdatePortfolioVariables>;

interface UpdatePortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePortfolioVariables): MutationRef<UpdatePortfolioData, UpdatePortfolioVariables>;
}
export const updatePortfolioRef: UpdatePortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePortfolio(dc: DataConnect, vars: UpdatePortfolioVariables): MutationPromise<UpdatePortfolioData, UpdatePortfolioVariables>;

interface UpdatePortfolioRef {
  ...
  (dc: DataConnect, vars: UpdatePortfolioVariables): MutationRef<UpdatePortfolioData, UpdatePortfolioVariables>;
}
export const updatePortfolioRef: UpdatePortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePortfolioRef:
```typescript
const name = updatePortfolioRef.operationName;
console.log(name);
```

### Variables
The `UpdatePortfolio` mutation requires an argument of type `UpdatePortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePortfolioVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdatePortfolio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePortfolioData {
  portfolio_update?: Portfolio_Key | null;
}
```
### Using `UpdatePortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePortfolio, UpdatePortfolioVariables } from '@dataconnect/generated';

// The `UpdatePortfolio` mutation requires an argument of type `UpdatePortfolioVariables`:
const updatePortfolioVars: UpdatePortfolioVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
};

// Call the `updatePortfolio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePortfolio(updatePortfolioVars);
// Variables can be defined inline as well.
const { data } = await updatePortfolio({ id: ..., name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePortfolio(dataConnect, updatePortfolioVars);

console.log(data.portfolio_update);

// Or, you can use the `Promise` API.
updatePortfolio(updatePortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.portfolio_update);
});
```

### Using `UpdatePortfolio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePortfolioRef, UpdatePortfolioVariables } from '@dataconnect/generated';

// The `UpdatePortfolio` mutation requires an argument of type `UpdatePortfolioVariables`:
const updatePortfolioVars: UpdatePortfolioVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
};

// Call the `updatePortfolioRef()` function to get a reference to the mutation.
const ref = updatePortfolioRef(updatePortfolioVars);
// Variables can be defined inline as well.
const ref = updatePortfolioRef({ id: ..., name: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePortfolioRef(dataConnect, updatePortfolioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.portfolio_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolio_update);
});
```

## DeletePortfolio
You can execute the `DeletePortfolio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deletePortfolio(vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;

interface DeletePortfolioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
}
export const deletePortfolioRef: DeletePortfolioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deletePortfolio(dc: DataConnect, vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;

interface DeletePortfolioRef {
  ...
  (dc: DataConnect, vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
}
export const deletePortfolioRef: DeletePortfolioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePortfolioRef:
```typescript
const name = deletePortfolioRef.operationName;
console.log(name);
```

### Variables
The `DeletePortfolio` mutation requires an argument of type `DeletePortfolioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePortfolioVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeletePortfolio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePortfolioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePortfolioData {
  portfolio_delete?: Portfolio_Key | null;
}
```
### Using `DeletePortfolio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deletePortfolio, DeletePortfolioVariables } from '@dataconnect/generated';

// The `DeletePortfolio` mutation requires an argument of type `DeletePortfolioVariables`:
const deletePortfolioVars: DeletePortfolioVariables = {
  id: ..., 
};

// Call the `deletePortfolio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deletePortfolio(deletePortfolioVars);
// Variables can be defined inline as well.
const { data } = await deletePortfolio({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deletePortfolio(dataConnect, deletePortfolioVars);

console.log(data.portfolio_delete);

// Or, you can use the `Promise` API.
deletePortfolio(deletePortfolioVars).then((response) => {
  const data = response.data;
  console.log(data.portfolio_delete);
});
```

### Using `DeletePortfolio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePortfolioRef, DeletePortfolioVariables } from '@dataconnect/generated';

// The `DeletePortfolio` mutation requires an argument of type `DeletePortfolioVariables`:
const deletePortfolioVars: DeletePortfolioVariables = {
  id: ..., 
};

// Call the `deletePortfolioRef()` function to get a reference to the mutation.
const ref = deletePortfolioRef(deletePortfolioVars);
// Variables can be defined inline as well.
const ref = deletePortfolioRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePortfolioRef(dataConnect, deletePortfolioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.portfolio_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolio_delete);
});
```

## InsertStock
You can execute the `InsertStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
insertStock(vars: InsertStockVariables): MutationPromise<InsertStockData, InsertStockVariables>;

interface InsertStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertStockVariables): MutationRef<InsertStockData, InsertStockVariables>;
}
export const insertStockRef: InsertStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertStock(dc: DataConnect, vars: InsertStockVariables): MutationPromise<InsertStockData, InsertStockVariables>;

interface InsertStockRef {
  ...
  (dc: DataConnect, vars: InsertStockVariables): MutationRef<InsertStockData, InsertStockVariables>;
}
export const insertStockRef: InsertStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertStockRef:
```typescript
const name = insertStockRef.operationName;
console.log(name);
```

### Variables
The `InsertStock` mutation requires an argument of type `InsertStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertStockVariables {
  tickerSymbol: string;
  companyName: string;
  sector?: string | null;
  currentPrice?: number | null;
}
```
### Return Type
Recall that executing the `InsertStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertStockData {
  stock_insert: Stock_Key;
}
```
### Using `InsertStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertStock, InsertStockVariables } from '@dataconnect/generated';

// The `InsertStock` mutation requires an argument of type `InsertStockVariables`:
const insertStockVars: InsertStockVariables = {
  tickerSymbol: ..., 
  companyName: ..., 
  sector: ..., // optional
  currentPrice: ..., // optional
};

// Call the `insertStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertStock(insertStockVars);
// Variables can be defined inline as well.
const { data } = await insertStock({ tickerSymbol: ..., companyName: ..., sector: ..., currentPrice: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertStock(dataConnect, insertStockVars);

console.log(data.stock_insert);

// Or, you can use the `Promise` API.
insertStock(insertStockVars).then((response) => {
  const data = response.data;
  console.log(data.stock_insert);
});
```

### Using `InsertStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertStockRef, InsertStockVariables } from '@dataconnect/generated';

// The `InsertStock` mutation requires an argument of type `InsertStockVariables`:
const insertStockVars: InsertStockVariables = {
  tickerSymbol: ..., 
  companyName: ..., 
  sector: ..., // optional
  currentPrice: ..., // optional
};

// Call the `insertStockRef()` function to get a reference to the mutation.
const ref = insertStockRef(insertStockVars);
// Variables can be defined inline as well.
const ref = insertStockRef({ tickerSymbol: ..., companyName: ..., sector: ..., currentPrice: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertStockRef(dataConnect, insertStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.stock_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.stock_insert);
});
```

## UpdateStockPrice
You can execute the `UpdateStockPrice` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStockPrice(vars: UpdateStockPriceVariables): MutationPromise<UpdateStockPriceData, UpdateStockPriceVariables>;

interface UpdateStockPriceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStockPriceVariables): MutationRef<UpdateStockPriceData, UpdateStockPriceVariables>;
}
export const updateStockPriceRef: UpdateStockPriceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStockPrice(dc: DataConnect, vars: UpdateStockPriceVariables): MutationPromise<UpdateStockPriceData, UpdateStockPriceVariables>;

interface UpdateStockPriceRef {
  ...
  (dc: DataConnect, vars: UpdateStockPriceVariables): MutationRef<UpdateStockPriceData, UpdateStockPriceVariables>;
}
export const updateStockPriceRef: UpdateStockPriceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStockPriceRef:
```typescript
const name = updateStockPriceRef.operationName;
console.log(name);
```

### Variables
The `UpdateStockPrice` mutation requires an argument of type `UpdateStockPriceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStockPriceVariables {
  id: UUIDString;
  price?: number | null;
}
```
### Return Type
Recall that executing the `UpdateStockPrice` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStockPriceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStockPriceData {
  stock_update?: Stock_Key | null;
}
```
### Using `UpdateStockPrice`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStockPrice, UpdateStockPriceVariables } from '@dataconnect/generated';

// The `UpdateStockPrice` mutation requires an argument of type `UpdateStockPriceVariables`:
const updateStockPriceVars: UpdateStockPriceVariables = {
  id: ..., 
  price: ..., // optional
};

// Call the `updateStockPrice()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStockPrice(updateStockPriceVars);
// Variables can be defined inline as well.
const { data } = await updateStockPrice({ id: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStockPrice(dataConnect, updateStockPriceVars);

console.log(data.stock_update);

// Or, you can use the `Promise` API.
updateStockPrice(updateStockPriceVars).then((response) => {
  const data = response.data;
  console.log(data.stock_update);
});
```

### Using `UpdateStockPrice`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStockPriceRef, UpdateStockPriceVariables } from '@dataconnect/generated';

// The `UpdateStockPrice` mutation requires an argument of type `UpdateStockPriceVariables`:
const updateStockPriceVars: UpdateStockPriceVariables = {
  id: ..., 
  price: ..., // optional
};

// Call the `updateStockPriceRef()` function to get a reference to the mutation.
const ref = updateStockPriceRef(updateStockPriceVars);
// Variables can be defined inline as well.
const ref = updateStockPriceRef({ id: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStockPriceRef(dataConnect, updateStockPriceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.stock_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.stock_update);
});
```

## DeleteStock
You can execute the `DeleteStock` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteStock(vars: DeleteStockVariables): MutationPromise<DeleteStockData, DeleteStockVariables>;

interface DeleteStockRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStockVariables): MutationRef<DeleteStockData, DeleteStockVariables>;
}
export const deleteStockRef: DeleteStockRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteStock(dc: DataConnect, vars: DeleteStockVariables): MutationPromise<DeleteStockData, DeleteStockVariables>;

interface DeleteStockRef {
  ...
  (dc: DataConnect, vars: DeleteStockVariables): MutationRef<DeleteStockData, DeleteStockVariables>;
}
export const deleteStockRef: DeleteStockRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteStockRef:
```typescript
const name = deleteStockRef.operationName;
console.log(name);
```

### Variables
The `DeleteStock` mutation requires an argument of type `DeleteStockVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteStockVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteStock` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteStockData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteStockData {
  stock_delete?: Stock_Key | null;
}
```
### Using `DeleteStock`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteStock, DeleteStockVariables } from '@dataconnect/generated';

// The `DeleteStock` mutation requires an argument of type `DeleteStockVariables`:
const deleteStockVars: DeleteStockVariables = {
  id: ..., 
};

// Call the `deleteStock()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteStock(deleteStockVars);
// Variables can be defined inline as well.
const { data } = await deleteStock({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteStock(dataConnect, deleteStockVars);

console.log(data.stock_delete);

// Or, you can use the `Promise` API.
deleteStock(deleteStockVars).then((response) => {
  const data = response.data;
  console.log(data.stock_delete);
});
```

### Using `DeleteStock`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteStockRef, DeleteStockVariables } from '@dataconnect/generated';

// The `DeleteStock` mutation requires an argument of type `DeleteStockVariables`:
const deleteStockVars: DeleteStockVariables = {
  id: ..., 
};

// Call the `deleteStockRef()` function to get a reference to the mutation.
const ref = deleteStockRef(deleteStockVars);
// Variables can be defined inline as well.
const ref = deleteStockRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteStockRef(dataConnect, deleteStockVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.stock_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.stock_delete);
});
```

## AddHolding
You can execute the `AddHolding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addHolding(vars: AddHoldingVariables): MutationPromise<AddHoldingData, AddHoldingVariables>;

interface AddHoldingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddHoldingVariables): MutationRef<AddHoldingData, AddHoldingVariables>;
}
export const addHoldingRef: AddHoldingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addHolding(dc: DataConnect, vars: AddHoldingVariables): MutationPromise<AddHoldingData, AddHoldingVariables>;

interface AddHoldingRef {
  ...
  (dc: DataConnect, vars: AddHoldingVariables): MutationRef<AddHoldingData, AddHoldingVariables>;
}
export const addHoldingRef: AddHoldingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addHoldingRef:
```typescript
const name = addHoldingRef.operationName;
console.log(name);
```

### Variables
The `AddHolding` mutation requires an argument of type `AddHoldingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddHoldingVariables {
  portfolioId: UUIDString;
  stockId: UUIDString;
  quantity: number;
  averageCost: number;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `AddHolding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddHoldingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddHoldingData {
  holding_insert: Holding_Key;
}
```
### Using `AddHolding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addHolding, AddHoldingVariables } from '@dataconnect/generated';

// The `AddHolding` mutation requires an argument of type `AddHoldingVariables`:
const addHoldingVars: AddHoldingVariables = {
  portfolioId: ..., 
  stockId: ..., 
  quantity: ..., 
  averageCost: ..., 
  notes: ..., // optional
};

// Call the `addHolding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addHolding(addHoldingVars);
// Variables can be defined inline as well.
const { data } = await addHolding({ portfolioId: ..., stockId: ..., quantity: ..., averageCost: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addHolding(dataConnect, addHoldingVars);

console.log(data.holding_insert);

// Or, you can use the `Promise` API.
addHolding(addHoldingVars).then((response) => {
  const data = response.data;
  console.log(data.holding_insert);
});
```

### Using `AddHolding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addHoldingRef, AddHoldingVariables } from '@dataconnect/generated';

// The `AddHolding` mutation requires an argument of type `AddHoldingVariables`:
const addHoldingVars: AddHoldingVariables = {
  portfolioId: ..., 
  stockId: ..., 
  quantity: ..., 
  averageCost: ..., 
  notes: ..., // optional
};

// Call the `addHoldingRef()` function to get a reference to the mutation.
const ref = addHoldingRef(addHoldingVars);
// Variables can be defined inline as well.
const ref = addHoldingRef({ portfolioId: ..., stockId: ..., quantity: ..., averageCost: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addHoldingRef(dataConnect, addHoldingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.holding_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.holding_insert);
});
```

## UpdateHolding
You can execute the `UpdateHolding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateHolding(vars: UpdateHoldingVariables): MutationPromise<UpdateHoldingData, UpdateHoldingVariables>;

interface UpdateHoldingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHoldingVariables): MutationRef<UpdateHoldingData, UpdateHoldingVariables>;
}
export const updateHoldingRef: UpdateHoldingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateHolding(dc: DataConnect, vars: UpdateHoldingVariables): MutationPromise<UpdateHoldingData, UpdateHoldingVariables>;

interface UpdateHoldingRef {
  ...
  (dc: DataConnect, vars: UpdateHoldingVariables): MutationRef<UpdateHoldingData, UpdateHoldingVariables>;
}
export const updateHoldingRef: UpdateHoldingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateHoldingRef:
```typescript
const name = updateHoldingRef.operationName;
console.log(name);
```

### Variables
The `UpdateHolding` mutation requires an argument of type `UpdateHoldingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateHoldingVariables {
  id: UUIDString;
  quantity?: number | null;
  averageCost?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `UpdateHolding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateHoldingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateHoldingData {
  holding_update?: Holding_Key | null;
}
```
### Using `UpdateHolding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateHolding, UpdateHoldingVariables } from '@dataconnect/generated';

// The `UpdateHolding` mutation requires an argument of type `UpdateHoldingVariables`:
const updateHoldingVars: UpdateHoldingVariables = {
  id: ..., 
  quantity: ..., // optional
  averageCost: ..., // optional
  notes: ..., // optional
};

// Call the `updateHolding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateHolding(updateHoldingVars);
// Variables can be defined inline as well.
const { data } = await updateHolding({ id: ..., quantity: ..., averageCost: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateHolding(dataConnect, updateHoldingVars);

console.log(data.holding_update);

// Or, you can use the `Promise` API.
updateHolding(updateHoldingVars).then((response) => {
  const data = response.data;
  console.log(data.holding_update);
});
```

### Using `UpdateHolding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateHoldingRef, UpdateHoldingVariables } from '@dataconnect/generated';

// The `UpdateHolding` mutation requires an argument of type `UpdateHoldingVariables`:
const updateHoldingVars: UpdateHoldingVariables = {
  id: ..., 
  quantity: ..., // optional
  averageCost: ..., // optional
  notes: ..., // optional
};

// Call the `updateHoldingRef()` function to get a reference to the mutation.
const ref = updateHoldingRef(updateHoldingVars);
// Variables can be defined inline as well.
const ref = updateHoldingRef({ id: ..., quantity: ..., averageCost: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateHoldingRef(dataConnect, updateHoldingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.holding_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.holding_update);
});
```

## DeleteHolding
You can execute the `DeleteHolding` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteHolding(vars: DeleteHoldingVariables): MutationPromise<DeleteHoldingData, DeleteHoldingVariables>;

interface DeleteHoldingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHoldingVariables): MutationRef<DeleteHoldingData, DeleteHoldingVariables>;
}
export const deleteHoldingRef: DeleteHoldingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteHolding(dc: DataConnect, vars: DeleteHoldingVariables): MutationPromise<DeleteHoldingData, DeleteHoldingVariables>;

interface DeleteHoldingRef {
  ...
  (dc: DataConnect, vars: DeleteHoldingVariables): MutationRef<DeleteHoldingData, DeleteHoldingVariables>;
}
export const deleteHoldingRef: DeleteHoldingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteHoldingRef:
```typescript
const name = deleteHoldingRef.operationName;
console.log(name);
```

### Variables
The `DeleteHolding` mutation requires an argument of type `DeleteHoldingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteHoldingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteHolding` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteHoldingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteHoldingData {
  holding_delete?: Holding_Key | null;
}
```
### Using `DeleteHolding`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteHolding, DeleteHoldingVariables } from '@dataconnect/generated';

// The `DeleteHolding` mutation requires an argument of type `DeleteHoldingVariables`:
const deleteHoldingVars: DeleteHoldingVariables = {
  id: ..., 
};

// Call the `deleteHolding()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteHolding(deleteHoldingVars);
// Variables can be defined inline as well.
const { data } = await deleteHolding({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteHolding(dataConnect, deleteHoldingVars);

console.log(data.holding_delete);

// Or, you can use the `Promise` API.
deleteHolding(deleteHoldingVars).then((response) => {
  const data = response.data;
  console.log(data.holding_delete);
});
```

### Using `DeleteHolding`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteHoldingRef, DeleteHoldingVariables } from '@dataconnect/generated';

// The `DeleteHolding` mutation requires an argument of type `DeleteHoldingVariables`:
const deleteHoldingVars: DeleteHoldingVariables = {
  id: ..., 
};

// Call the `deleteHoldingRef()` function to get a reference to the mutation.
const ref = deleteHoldingRef(deleteHoldingVars);
// Variables can be defined inline as well.
const ref = deleteHoldingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteHoldingRef(dataConnect, deleteHoldingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.holding_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.holding_delete);
});
```

## CreateTransaction
You can execute the `CreateTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface CreateTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
}
export const createTransactionRef: CreateTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface CreateTransactionRef {
  ...
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
}
export const createTransactionRef: CreateTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTransactionRef:
```typescript
const name = createTransactionRef.operationName;
console.log(name);
```

### Variables
The `CreateTransaction` mutation requires an argument of type `CreateTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTransactionVariables {
  holdingId: UUIDString;
  type: string;
  quantity: number;
  price: number;
  broker?: string | null;
}
```
### Return Type
Recall that executing the `CreateTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTransactionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}
```
### Using `CreateTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTransaction, CreateTransactionVariables } from '@dataconnect/generated';

// The `CreateTransaction` mutation requires an argument of type `CreateTransactionVariables`:
const createTransactionVars: CreateTransactionVariables = {
  holdingId: ..., 
  type: ..., 
  quantity: ..., 
  price: ..., 
  broker: ..., // optional
};

// Call the `createTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTransaction(createTransactionVars);
// Variables can be defined inline as well.
const { data } = await createTransaction({ holdingId: ..., type: ..., quantity: ..., price: ..., broker: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTransaction(dataConnect, createTransactionVars);

console.log(data.transaction_insert);

// Or, you can use the `Promise` API.
createTransaction(createTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.transaction_insert);
});
```

### Using `CreateTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTransactionRef, CreateTransactionVariables } from '@dataconnect/generated';

// The `CreateTransaction` mutation requires an argument of type `CreateTransactionVariables`:
const createTransactionVars: CreateTransactionVariables = {
  holdingId: ..., 
  type: ..., 
  quantity: ..., 
  price: ..., 
  broker: ..., // optional
};

// Call the `createTransactionRef()` function to get a reference to the mutation.
const ref = createTransactionRef(createTransactionVars);
// Variables can be defined inline as well.
const ref = createTransactionRef({ holdingId: ..., type: ..., quantity: ..., price: ..., broker: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTransactionRef(dataConnect, createTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transaction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transaction_insert);
});
```

## DeleteTransaction
You can execute the `DeleteTransaction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface DeleteTransactionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
}
export const deleteTransactionRef: DeleteTransactionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface DeleteTransactionRef {
  ...
  (dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
}
export const deleteTransactionRef: DeleteTransactionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTransactionRef:
```typescript
const name = deleteTransactionRef.operationName;
console.log(name);
```

### Variables
The `DeleteTransaction` mutation requires an argument of type `DeleteTransactionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTransactionVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTransaction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTransactionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}
```
### Using `DeleteTransaction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTransaction, DeleteTransactionVariables } from '@dataconnect/generated';

// The `DeleteTransaction` mutation requires an argument of type `DeleteTransactionVariables`:
const deleteTransactionVars: DeleteTransactionVariables = {
  id: ..., 
};

// Call the `deleteTransaction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTransaction(deleteTransactionVars);
// Variables can be defined inline as well.
const { data } = await deleteTransaction({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTransaction(dataConnect, deleteTransactionVars);

console.log(data.transaction_delete);

// Or, you can use the `Promise` API.
deleteTransaction(deleteTransactionVars).then((response) => {
  const data = response.data;
  console.log(data.transaction_delete);
});
```

### Using `DeleteTransaction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTransactionRef, DeleteTransactionVariables } from '@dataconnect/generated';

// The `DeleteTransaction` mutation requires an argument of type `DeleteTransactionVariables`:
const deleteTransactionVars: DeleteTransactionVariables = {
  id: ..., 
};

// Call the `deleteTransactionRef()` function to get a reference to the mutation.
const ref = deleteTransactionRef(deleteTransactionVars);
// Variables can be defined inline as well.
const ref = deleteTransactionRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTransactionRef(dataConnect, deleteTransactionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.transaction_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.transaction_delete);
});
```

## AddToWatchlist
You can execute the `AddToWatchlist` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addToWatchlist(vars: AddToWatchlistVariables): MutationPromise<AddToWatchlistData, AddToWatchlistVariables>;

interface AddToWatchlistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddToWatchlistVariables): MutationRef<AddToWatchlistData, AddToWatchlistVariables>;
}
export const addToWatchlistRef: AddToWatchlistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addToWatchlist(dc: DataConnect, vars: AddToWatchlistVariables): MutationPromise<AddToWatchlistData, AddToWatchlistVariables>;

interface AddToWatchlistRef {
  ...
  (dc: DataConnect, vars: AddToWatchlistVariables): MutationRef<AddToWatchlistData, AddToWatchlistVariables>;
}
export const addToWatchlistRef: AddToWatchlistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addToWatchlistRef:
```typescript
const name = addToWatchlistRef.operationName;
console.log(name);
```

### Variables
The `AddToWatchlist` mutation requires an argument of type `AddToWatchlistVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddToWatchlistVariables {
  stockId: UUIDString;
  targetPrice?: number | null;
}
```
### Return Type
Recall that executing the `AddToWatchlist` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddToWatchlistData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddToWatchlistData {
  watchlistItem_insert: WatchlistItem_Key;
}
```
### Using `AddToWatchlist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addToWatchlist, AddToWatchlistVariables } from '@dataconnect/generated';

// The `AddToWatchlist` mutation requires an argument of type `AddToWatchlistVariables`:
const addToWatchlistVars: AddToWatchlistVariables = {
  stockId: ..., 
  targetPrice: ..., // optional
};

// Call the `addToWatchlist()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addToWatchlist(addToWatchlistVars);
// Variables can be defined inline as well.
const { data } = await addToWatchlist({ stockId: ..., targetPrice: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addToWatchlist(dataConnect, addToWatchlistVars);

console.log(data.watchlistItem_insert);

// Or, you can use the `Promise` API.
addToWatchlist(addToWatchlistVars).then((response) => {
  const data = response.data;
  console.log(data.watchlistItem_insert);
});
```

### Using `AddToWatchlist`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addToWatchlistRef, AddToWatchlistVariables } from '@dataconnect/generated';

// The `AddToWatchlist` mutation requires an argument of type `AddToWatchlistVariables`:
const addToWatchlistVars: AddToWatchlistVariables = {
  stockId: ..., 
  targetPrice: ..., // optional
};

// Call the `addToWatchlistRef()` function to get a reference to the mutation.
const ref = addToWatchlistRef(addToWatchlistVars);
// Variables can be defined inline as well.
const ref = addToWatchlistRef({ stockId: ..., targetPrice: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addToWatchlistRef(dataConnect, addToWatchlistVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.watchlistItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.watchlistItem_insert);
});
```

## RemoveFromWatchlist
You can execute the `RemoveFromWatchlist` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
removeFromWatchlist(vars: RemoveFromWatchlistVariables): MutationPromise<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;

interface RemoveFromWatchlistRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveFromWatchlistVariables): MutationRef<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;
}
export const removeFromWatchlistRef: RemoveFromWatchlistRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeFromWatchlist(dc: DataConnect, vars: RemoveFromWatchlistVariables): MutationPromise<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;

interface RemoveFromWatchlistRef {
  ...
  (dc: DataConnect, vars: RemoveFromWatchlistVariables): MutationRef<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;
}
export const removeFromWatchlistRef: RemoveFromWatchlistRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeFromWatchlistRef:
```typescript
const name = removeFromWatchlistRef.operationName;
console.log(name);
```

### Variables
The `RemoveFromWatchlist` mutation requires an argument of type `RemoveFromWatchlistVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveFromWatchlistVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveFromWatchlist` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveFromWatchlistData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveFromWatchlistData {
  watchlistItem_delete?: WatchlistItem_Key | null;
}
```
### Using `RemoveFromWatchlist`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeFromWatchlist, RemoveFromWatchlistVariables } from '@dataconnect/generated';

// The `RemoveFromWatchlist` mutation requires an argument of type `RemoveFromWatchlistVariables`:
const removeFromWatchlistVars: RemoveFromWatchlistVariables = {
  id: ..., 
};

// Call the `removeFromWatchlist()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeFromWatchlist(removeFromWatchlistVars);
// Variables can be defined inline as well.
const { data } = await removeFromWatchlist({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeFromWatchlist(dataConnect, removeFromWatchlistVars);

console.log(data.watchlistItem_delete);

// Or, you can use the `Promise` API.
removeFromWatchlist(removeFromWatchlistVars).then((response) => {
  const data = response.data;
  console.log(data.watchlistItem_delete);
});
```

### Using `RemoveFromWatchlist`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeFromWatchlistRef, RemoveFromWatchlistVariables } from '@dataconnect/generated';

// The `RemoveFromWatchlist` mutation requires an argument of type `RemoveFromWatchlistVariables`:
const removeFromWatchlistVars: RemoveFromWatchlistVariables = {
  id: ..., 
};

// Call the `removeFromWatchlistRef()` function to get a reference to the mutation.
const ref = removeFromWatchlistRef(removeFromWatchlistVars);
// Variables can be defined inline as well.
const ref = removeFromWatchlistRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeFromWatchlistRef(dataConnect, removeFromWatchlistVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.watchlistItem_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.watchlistItem_delete);
});
```

