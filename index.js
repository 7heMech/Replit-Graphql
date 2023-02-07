const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? httpAgent : httpsAgent;

const { SID: CONNECT_SID = "" } = process.env;

let req;

const originalEmit = process.emit; 
if (typeof fetch !== 'undefined') {
	process.emit = function (name, data, ...args) { 
  	if (name === "warning" && typeof data === "object" && data.name === "ExperimentalWarning" && data.message.includes("Fetch API")) return false; 
  	return originalEmit.apply(process, arguments);
	};
	req = fetch;
} else req = require("./fetch.cjs");

/**
 * @function graphql
 * @async
 * @param {String} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {Promise<Object|Array>} - The response data or errors from the server.
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
	const json = await res.json();
	return json?.data || json?.errors;
}

module.exports = graphql;