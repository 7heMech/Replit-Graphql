const { EventEmitter } = require('events');

const https = require('https');
const WebSocket = require('ws');

const { SID: CONNECT_SID = '' } = process.env;

const agent = new https.Agent({ keepAlive: true });

const req = typeof fetch === 'undefined' ? require('./fetch.cjs') : fetch;

const headers = {
	host: 'replit.com',
	'user-agent': 'replit',
	accept: 'application/json',
	origin: 'https://replit.com',
	referrer: 'https://replit.com',
	'content-type': 'application/json',
	'x-requested-with': 'XMLHttpRequest',
	cookie: 'connect.sid=' + CONNECT_SID,
};

const graphql = async (query, variables) => {
	const res = await req(`https://replit.com/graphql?e=${Math.round(Math.random() * 100)}`, {
		agent,
		headers,
		method: 'POST',
		body: JSON.stringify({ query, variables }),
	});
	return await res.json();
}

/**
 * This function performs a GraphQL query with the given query and variables.  
 * @function query
 * @async
 * @param {String} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {Promise<Object>} - The response from the server.
 */
const query = async (query, variables) => await graphql(`query ${query}`, variables);

/**
 * This function performs a GraphQL mutation with the given query and variables.  
 * @function mutate
 * @async
 * @param {String} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {Promise<Object>} - The response from the server.
 */
const mutate = async (query, variables) => await graphql(`mutation ${query}`, variables);


const emitters = [];
const msgs = [];

let counter = 0;
let ws;

/**
 * This function performs a GraphQL subscription with the given query and variables.  
 * @function subscribe
 * @async
 * @param {String} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {EventEmitter} - The response from the server.
 */
const subscribe = (query, variables) => {
	if (!ws) {
		ws = new WebSocket(
			`wss://replit.com/graphql_subscriptions`,
			'graphql-ws',
			{ headers },
		);

		ws.on('open', () => {
			ws.send('{"type":"connection_init","payload":{}}');
			msgs.forEach((msg) => ws.send(msg));
		});

		ws.on('message', (data) => {
			const { id, type, payload } = JSON.parse(data);
			const emitter = emitters[id];
			if (!emitter) return;

			if (type === 'data') emitter.emit('data', payload);
			else if (type === 'complete') emitter.unsubscribe();
		});
	}

	const subscription = new EventEmitter();
	emitters.push(subscription);
	const id = counter++;

	subscription.unsubscribe = () => {
		ws.send(`{"id":"${id}","type":"stop"}`);
		subscription.emit('end');
		emitters[id] = null;
	}

	query = `subscription ${query}`;
	const msg = JSON.stringify({
		type: 'start',
		id,
		payload: {
			variables,
			query,
		}
	});

	if (ws.readyState !== 1)
		msgs.push(msg);
	else
		ws.send(msg);

	return subscription;
}

module.exports = { query, mutate, subscribe };