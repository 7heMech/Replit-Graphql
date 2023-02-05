const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? httpAgent : httpsAgent;

const { SID: CONNECT_SID = "" } = process.env;
const request = typeof fetch === 'undefined' ? require("./fetch.cjs") : fetch;

/**
 * @function graphql
 * @async
 * @param {string} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {Promise<Object|Array>} - The response data or errors from the server.
 */
const graphql = async (query, variables) => {
		const response = await request(`https://replit.com/graphql?e=${Math.round(Math.random() * 100)}`, {
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
	const res = await response.json();
	return res?.data || res?.errors;
}

module.exports = graphql;