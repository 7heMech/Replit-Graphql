An easy way to use the replit's graphql API.
## Usage
```js
const graphql = require("replit-graphql");

const query = "",
	variables = {};

graphql(query, variables).then(console.log);
```