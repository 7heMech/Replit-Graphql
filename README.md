# Replit GraphQL Client
Replit GraphQL is a package that interacts with the Replit's GraphQL API to send GraphQL queries, mutations and subscriptions. It uses a keep-alive connection to make requests faster.

## Installation
To use Replit GraphQL, install it using npm:
```sh
npm install replit-graphql
```
## Usage
```js
const replit = require('replit-graphql');

const query = 'query {userByUsername(username: "7heMech") {id}}';

const variables = {};

replit.query(query, variables).then(console.log);
```
## API
Replit GraphQL exports an object with the following functions:

> `query(query: String, variables: object|string) => Promise<object>`

Performs a GraphQL query with the given `query` and `variables`. Returns a Promise that resolves to the query result.

> `subscribe(query: String, variables: object|string) => EventEmitter`

Performs a GraphQL subscription with the given query and variables. It returns an `EventEmitter` object. The returned object also has an `unsubscribe` method.

> `setSid(sid: String) => undefined`

Sets the sid used for queries

## Contributing
Contributions are welcome! If you find a bug or want to add a new feature, please open an issue or submit a pull request on the [GitHub repository](https://github.com/7hemech/replit-graphql).