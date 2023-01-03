const fetch = require("./fetch.cjs");
/**
 * @param {String} query The graphql query
 * @param {(Object|String)} variables The query variables
 * @returns {Object} Query response
 */
const graphql = async (query, variables) => {
	const response = await fetch(`https://replit.com/graphql?e=${Math.round(Math.random() * 100)}`, {
		"headers": {
			"Accept": "application/json",
			"User-Agent": "replit",
			"X-Requested-With": "replit",
			"Origin": "https://replit.com",
			"Content-Type": "application/json",
			"Referrer-Policy": "strict-origin-when-cross-origin",
			"Cookie": "connect.sid=" + process.env.SID
		},
		"body": JSON.stringify({ query, variables }),
		"method": "POST"
	});
	const res = await response.json();
	return res?.data || res?.errors;
}

module.exports = graphql;