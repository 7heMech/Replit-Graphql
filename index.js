const http = require('http');
const https = require('https');

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const agent = (_parsedURL) => _parsedURL.protocol == 'http:' ? httpAgent : httpsAgent;

const { SID: CONNECT_SID = "" } = process.env;
const request = fetch || require("./fetch.cjs");

/**
 * @param {String} query The graphql query
 * @param {(Object|String)} variables The variables used in the query
 * @returns {Promise<Object>} Query response
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