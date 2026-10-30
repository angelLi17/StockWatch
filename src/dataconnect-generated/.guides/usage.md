# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { insertUser, updateUser, deleteUser, getCurrentUser, createPortfolio, updatePortfolio, deletePortfolio, listMyPortfolios, insertStock, updateStockPrice } from '@dataconnect/generated';


// Operation InsertUser:  For variables, look at type InsertUserVars in ../index.d.ts
const { data } = await InsertUser(dataConnect, insertUserVars);

// Operation UpdateUser:  For variables, look at type UpdateUserVars in ../index.d.ts
const { data } = await UpdateUser(dataConnect, updateUserVars);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation CreatePortfolio:  For variables, look at type CreatePortfolioVars in ../index.d.ts
const { data } = await CreatePortfolio(dataConnect, createPortfolioVars);

// Operation UpdatePortfolio:  For variables, look at type UpdatePortfolioVars in ../index.d.ts
const { data } = await UpdatePortfolio(dataConnect, updatePortfolioVars);

// Operation DeletePortfolio:  For variables, look at type DeletePortfolioVars in ../index.d.ts
const { data } = await DeletePortfolio(dataConnect, deletePortfolioVars);

// Operation ListMyPortfolios: 
const { data } = await ListMyPortfolios(dataConnect);

// Operation InsertStock:  For variables, look at type InsertStockVars in ../index.d.ts
const { data } = await InsertStock(dataConnect, insertStockVars);

// Operation UpdateStockPrice:  For variables, look at type UpdateStockPriceVars in ../index.d.ts
const { data } = await UpdateStockPrice(dataConnect, updateStockPriceVars);


```