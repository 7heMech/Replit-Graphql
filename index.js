const { SID: CONNECT_SID = "" } = process.env,
		request = fetch || require("./fetch.cjs");
/**
 * @param {String} query The graphql query
 * @param {(Object|String)} variables The variables used in the query
 * @returns {Promise<Object>} Query response
 */
const graphql = async (query, variables) => {
		const response = await request(`https://replit.com/graphql?e=${Math.round(Math.random() * 100)}`, {
		"headers": {
			"User-Agent": "replit-api",
			"Accept": "application/json",
			"Origin": "https://replit.com",
			"Referrer": "https://replit.com",
			"Content-Type": "application/json",
			"X-Requested-With": "XMLHttpRequest",
			"Cookie": "connect.sid=" + CONNECT_SID
		},
		"body": JSON.stringify({query, variables}),
		"method": "POST"
	});
	const res = await response.json();
	return res?.data || res?.errors;
}

module.exports = graphql;