An easy way to use the replit's graphql API.

Implemented with keep alive for 2x faster requests.
## Usage
```js
const graphql = require("replit-graphql");

const query = "", variables = {};

const data = await graphql(query, variables);
```
If you want to use your sid, making a secret called `SID` will work.