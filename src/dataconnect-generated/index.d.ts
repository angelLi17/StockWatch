import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddHoldingData {
  holding_insert: Holding_Key;
}

export interface AddHoldingVariables {
  portfolioId: UUIDString;
  stockId: UUIDString;
  quantity: number;
  averageCost: number;
  notes?: string | null;
}

export interface AddToWatchlistData {
  watchlistItem_insert: WatchlistItem_Key;
}

export interface AddToWatchlistVariables {
  stockId: UUIDString;
  targetPrice?: number | null;
}

export interface CreatePortfolioData {
  portfolio_insert: Portfolio_Key;
}

export interface CreatePortfolioVariables {
  name: string;
  description?: string | null;
}

export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}

export interface CreateTransactionVariables {
  holdingId: UUIDString;
  type: string;
  quantity: number;
  price: number;
  broker?: string | null;
}

export interface DeleteHoldingData {
  holding_delete?: Holding_Key | null;
}

export interface DeleteHoldingVariables {
  id: UUIDString;
}

export interface DeletePortfolioData {
  portfolio_delete?: Portfolio_Key | null;
}

export interface DeletePortfolioVariables {
  id: UUIDString;
}

export interface DeleteStockData {
  stock_delete?: Stock_Key | null;
}

export interface DeleteStockVariables {
  id: UUIDString;
}

export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}

export interface DeleteTransactionVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetCurrentUserData {
  user?: {
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
    createdAt: TimestampString;
  };
}

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

export interface GetHoldingVariables {
  id: UUIDString;
}

export interface GetStockData {
  stock?: {
    tickerSymbol: string;
    companyName: string;
    currentPrice?: number | null;
  };
}

export interface GetStockVariables {
  id: UUIDString;
}

export interface GetWatchlistData {
  watchlistItems: ({
    stock: {
      tickerSymbol: string;
    };
    targetPriceAlert?: number | null;
  })[];
}

export interface Holding_Key {
  id: UUIDString;
  __typename?: 'Holding_Key';
}

export interface InsertStockData {
  stock_insert: Stock_Key;
}

export interface InsertStockVariables {
  tickerSymbol: string;
  companyName: string;
  sector?: string | null;
  currentPrice?: number | null;
}

export interface InsertUserData {
  user_insert: User_Key;
}

export interface InsertUserVariables {
  email: string;
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface ListMyPortfoliosData {
  portfolios: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Portfolio_Key)[];
}

export interface ListStocksData {
  stocks: ({
    tickerSymbol: string;
    companyName: string;
    currentPrice?: number | null;
  })[];
}

export interface ListTransactionsData {
  transactions: ({
    type: string;
    quantity: number;
    pricePerShare: number;
    timestamp: TimestampString;
  })[];
}

export interface ListTransactionsVariables {
  holdingId: UUIDString;
}

export interface Portfolio_Key {
  id: UUIDString;
  __typename?: 'Portfolio_Key';
}

export interface RemoveFromWatchlistData {
  watchlistItem_delete?: WatchlistItem_Key | null;
}

export interface RemoveFromWatchlistVariables {
  id: UUIDString;
}

export interface Stock_Key {
  id: UUIDString;
  __typename?: 'Stock_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface UpdateHoldingData {
  holding_update?: Holding_Key | null;
}

export interface UpdateHoldingVariables {
  id: UUIDString;
  quantity?: number | null;
  averageCost?: number | null;
  notes?: string | null;
}

export interface UpdatePortfolioData {
  portfolio_update?: Portfolio_Key | null;
}

export interface UpdatePortfolioVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
}

export interface UpdateStockPriceData {
  stock_update?: Stock_Key | null;
}

export interface UpdateStockPriceVariables {
  id: UUIDString;
  price?: number | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  displayName?: string | null;
  avatarUrl?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WatchlistItem_Key {
  id: UUIDString;
  __typename?: 'WatchlistItem_Key';
}

interface InsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertUserVariables): MutationRef<InsertUserData, InsertUserVariables>;
  operationName: string;
}
export const insertUserRef: InsertUserRef;

export function insertUser(vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;
export function insertUser(dc: DataConnect, vars: InsertUserVariables): MutationPromise<InsertUserData, InsertUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars?: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface CreatePortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePortfolioVariables): MutationRef<CreatePortfolioData, CreatePortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePortfolioVariables): MutationRef<CreatePortfolioData, CreatePortfolioVariables>;
  operationName: string;
}
export const createPortfolioRef: CreatePortfolioRef;

export function createPortfolio(vars: CreatePortfolioVariables): MutationPromise<CreatePortfolioData, CreatePortfolioVariables>;
export function createPortfolio(dc: DataConnect, vars: CreatePortfolioVariables): MutationPromise<CreatePortfolioData, CreatePortfolioVariables>;

interface UpdatePortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePortfolioVariables): MutationRef<UpdatePortfolioData, UpdatePortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePortfolioVariables): MutationRef<UpdatePortfolioData, UpdatePortfolioVariables>;
  operationName: string;
}
export const updatePortfolioRef: UpdatePortfolioRef;

export function updatePortfolio(vars: UpdatePortfolioVariables): MutationPromise<UpdatePortfolioData, UpdatePortfolioVariables>;
export function updatePortfolio(dc: DataConnect, vars: UpdatePortfolioVariables): MutationPromise<UpdatePortfolioData, UpdatePortfolioVariables>;

interface DeletePortfolioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePortfolioVariables): MutationRef<DeletePortfolioData, DeletePortfolioVariables>;
  operationName: string;
}
export const deletePortfolioRef: DeletePortfolioRef;

export function deletePortfolio(vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;
export function deletePortfolio(dc: DataConnect, vars: DeletePortfolioVariables): MutationPromise<DeletePortfolioData, DeletePortfolioVariables>;

interface ListMyPortfoliosRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyPortfoliosData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyPortfoliosData, undefined>;
  operationName: string;
}
export const listMyPortfoliosRef: ListMyPortfoliosRef;

export function listMyPortfolios(options?: ExecuteQueryOptions): QueryPromise<ListMyPortfoliosData, undefined>;
export function listMyPortfolios(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyPortfoliosData, undefined>;

interface InsertStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertStockVariables): MutationRef<InsertStockData, InsertStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertStockVariables): MutationRef<InsertStockData, InsertStockVariables>;
  operationName: string;
}
export const insertStockRef: InsertStockRef;

export function insertStock(vars: InsertStockVariables): MutationPromise<InsertStockData, InsertStockVariables>;
export function insertStock(dc: DataConnect, vars: InsertStockVariables): MutationPromise<InsertStockData, InsertStockVariables>;

interface UpdateStockPriceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStockPriceVariables): MutationRef<UpdateStockPriceData, UpdateStockPriceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStockPriceVariables): MutationRef<UpdateStockPriceData, UpdateStockPriceVariables>;
  operationName: string;
}
export const updateStockPriceRef: UpdateStockPriceRef;

export function updateStockPrice(vars: UpdateStockPriceVariables): MutationPromise<UpdateStockPriceData, UpdateStockPriceVariables>;
export function updateStockPrice(dc: DataConnect, vars: UpdateStockPriceVariables): MutationPromise<UpdateStockPriceData, UpdateStockPriceVariables>;

interface DeleteStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteStockVariables): MutationRef<DeleteStockData, DeleteStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteStockVariables): MutationRef<DeleteStockData, DeleteStockVariables>;
  operationName: string;
}
export const deleteStockRef: DeleteStockRef;

export function deleteStock(vars: DeleteStockVariables): MutationPromise<DeleteStockData, DeleteStockVariables>;
export function deleteStock(dc: DataConnect, vars: DeleteStockVariables): MutationPromise<DeleteStockData, DeleteStockVariables>;

interface GetStockRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetStockVariables): QueryRef<GetStockData, GetStockVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetStockVariables): QueryRef<GetStockData, GetStockVariables>;
  operationName: string;
}
export const getStockRef: GetStockRef;

export function getStock(vars: GetStockVariables, options?: ExecuteQueryOptions): QueryPromise<GetStockData, GetStockVariables>;
export function getStock(dc: DataConnect, vars: GetStockVariables, options?: ExecuteQueryOptions): QueryPromise<GetStockData, GetStockVariables>;

interface ListStocksRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListStocksData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListStocksData, undefined>;
  operationName: string;
}
export const listStocksRef: ListStocksRef;

export function listStocks(options?: ExecuteQueryOptions): QueryPromise<ListStocksData, undefined>;
export function listStocks(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListStocksData, undefined>;

interface AddHoldingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddHoldingVariables): MutationRef<AddHoldingData, AddHoldingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddHoldingVariables): MutationRef<AddHoldingData, AddHoldingVariables>;
  operationName: string;
}
export const addHoldingRef: AddHoldingRef;

export function addHolding(vars: AddHoldingVariables): MutationPromise<AddHoldingData, AddHoldingVariables>;
export function addHolding(dc: DataConnect, vars: AddHoldingVariables): MutationPromise<AddHoldingData, AddHoldingVariables>;

interface UpdateHoldingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHoldingVariables): MutationRef<UpdateHoldingData, UpdateHoldingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateHoldingVariables): MutationRef<UpdateHoldingData, UpdateHoldingVariables>;
  operationName: string;
}
export const updateHoldingRef: UpdateHoldingRef;

export function updateHolding(vars: UpdateHoldingVariables): MutationPromise<UpdateHoldingData, UpdateHoldingVariables>;
export function updateHolding(dc: DataConnect, vars: UpdateHoldingVariables): MutationPromise<UpdateHoldingData, UpdateHoldingVariables>;

interface DeleteHoldingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteHoldingVariables): MutationRef<DeleteHoldingData, DeleteHoldingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteHoldingVariables): MutationRef<DeleteHoldingData, DeleteHoldingVariables>;
  operationName: string;
}
export const deleteHoldingRef: DeleteHoldingRef;

export function deleteHolding(vars: DeleteHoldingVariables): MutationPromise<DeleteHoldingData, DeleteHoldingVariables>;
export function deleteHolding(dc: DataConnect, vars: DeleteHoldingVariables): MutationPromise<DeleteHoldingData, DeleteHoldingVariables>;

interface GetHoldingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetHoldingVariables): QueryRef<GetHoldingData, GetHoldingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetHoldingVariables): QueryRef<GetHoldingData, GetHoldingVariables>;
  operationName: string;
}
export const getHoldingRef: GetHoldingRef;

export function getHolding(vars: GetHoldingVariables, options?: ExecuteQueryOptions): QueryPromise<GetHoldingData, GetHoldingVariables>;
export function getHolding(dc: DataConnect, vars: GetHoldingVariables, options?: ExecuteQueryOptions): QueryPromise<GetHoldingData, GetHoldingVariables>;

interface CreateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  operationName: string;
}
export const createTransactionRef: CreateTransactionRef;

export function createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface DeleteTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  operationName: string;
}
export const deleteTransactionRef: DeleteTransactionRef;

export function deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;
export function deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface ListTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  operationName: string;
}
export const listTransactionsRef: ListTransactionsRef;

export function listTransactions(vars: ListTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsData, ListTransactionsVariables>;
export function listTransactions(dc: DataConnect, vars: ListTransactionsVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface AddToWatchlistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddToWatchlistVariables): MutationRef<AddToWatchlistData, AddToWatchlistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddToWatchlistVariables): MutationRef<AddToWatchlistData, AddToWatchlistVariables>;
  operationName: string;
}
export const addToWatchlistRef: AddToWatchlistRef;

export function addToWatchlist(vars: AddToWatchlistVariables): MutationPromise<AddToWatchlistData, AddToWatchlistVariables>;
export function addToWatchlist(dc: DataConnect, vars: AddToWatchlistVariables): MutationPromise<AddToWatchlistData, AddToWatchlistVariables>;

interface RemoveFromWatchlistRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveFromWatchlistVariables): MutationRef<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveFromWatchlistVariables): MutationRef<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;
  operationName: string;
}
export const removeFromWatchlistRef: RemoveFromWatchlistRef;

export function removeFromWatchlist(vars: RemoveFromWatchlistVariables): MutationPromise<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;
export function removeFromWatchlist(dc: DataConnect, vars: RemoveFromWatchlistVariables): MutationPromise<RemoveFromWatchlistData, RemoveFromWatchlistVariables>;

interface GetWatchlistRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetWatchlistData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetWatchlistData, undefined>;
  operationName: string;
}
export const getWatchlistRef: GetWatchlistRef;

export function getWatchlist(options?: ExecuteQueryOptions): QueryPromise<GetWatchlistData, undefined>;
export function getWatchlist(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetWatchlistData, undefined>;

