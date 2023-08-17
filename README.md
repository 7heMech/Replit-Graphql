# Replit GraphQL Client
Replit GraphQL is the most performant, isomorphic package which interacts with the Replit's GraphQL API to send GraphQL queries, mutations and subscriptions.

## Installation
Installed it by running this command in the Shell tab in your Repl
```sh
npm install replit-graphql
```
## Usage
```js
const replit = require('replit-graphql');

const query = '{user(id:1){username}}';

replit.query(query).then(console.log);
```
## API
Replit GraphQL exports an object with the following functions:

```ts
function query(query: string, config?: {
	variables?: object|string,
	raw?: boolean
}) => Promise<object|string>
```
Performs a GraphQL query with the given `query` and `variables`. Returns a Promise that resolves to the query result.

```ts
function subscribe(query: string, config?: {
		variables?: object|string
	}) => EventEmitter
```
Performs a GraphQL subscription with the given query and variables. It returns an `EventEmitter` which has the following methods:
* `on(eventName: string, callback)`
* `unsubscribe`

```ts
function setSid(sid: string) => void
```
Sets the sid which is used for queries and subscriptions. If you have an environment variable/secret called SID, that will be used by default.

## Contributing
Contributions are welcome! If you find a bug or want to add a new feature, please open an issue or submit a pull request on the [GitHub repository](https://github.com/7hemech/replit-graphql).