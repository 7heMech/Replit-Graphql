const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? httpAgent : httpsAgent;

const { SID: CONNECT_SID = "" } = process.env;

let req;
// Ignore experimental fetch warning
if("undefined"!=typeof fetch){let e=process.emit;process.emit=function(n,t,...i){return!("warning"===n&&"object"==typeof t&&"ExperimentalWarning"===t.name&&t.message.includes("Fetch API"))&&e.apply(process,arguments)},req=fetch}else req=require("./fetch.cjs");


/**
 * @function graphql
 * @async
 * @param {String} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {Promise<Object>} - The response from the server.
 */
const graphql = async (query, variables) => {
		const res = await req(`https://replit.com/graphql?e=${Math.round(Math.random()*100)}`, {
		"agent": agent,
		"method": "POST",
		"headers": {
			"Host": "replit.com",
			"User-Agent": "replit",
			"Accept": "application/json",
			"Origin": "https://replit.com",
			"Referrer": "https://replit.com",
			"Content-Type": "application/json",
			"X-Requested-With": "XMLHttpRequest",
			"Cookie": "connect.sid=" + CONNECT_SID
		},
		"body": JSON.stringify({ query, variables })
	});
	return await res.json();
}

module.exports = graphql;