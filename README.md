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

const query = '{userByUsername(username: "7heMech") {id}}';

const variables = {};

replit.query(query, variables).then(console.log);
```
If you want to use your sid, making a secret called `SID` will work.
## API
Replit GraphQL exports an object with the following functions:

> `query(query: String, variables: object|string) => Promise<object>`

Performs a GraphQL query with the given `query` and `variables`. Returns a Promise that resolves to the query result.

> `mutate(query: String, variables: object|string) => Promise<object>`

Performs a GraphQL mutation with the given `query` and `variables`. Returns a Promise that resolves to the mutation result.

> `subscribe(query: String, variables: object|string) => EventEmitter`

Performs a GraphQL subscription with the given query and variables. It returns an `EventEmitter` object that can be used to handle the data sent by the server. The returned `EventEmitter` also has an `unsubscribe` method that can be called to stop the subscription.
 
**Note:** The `subscribe` function returns an `EventEmitter` object. You should attach an event listener to the `data` event of the emitter to handle the data sent by the server.
## Contributing
Contributions are welcome! If you find a bug or want to add a new feature, please open an issue or submit a pull request on the [GitHub repository](https://github.com/7hemech/replit-graphql).