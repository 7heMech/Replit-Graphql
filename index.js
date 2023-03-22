const { EventEmitter } = require('events');
const WebSocket = require('ws');

const req = require('./req');

const headers = {
	referrer: 'https://replit.com',
	'content-type': 'application/json',
	'x-requested-with': 'XMLHttpRequest',
	cookie: `connect.sid=${process.env.SID}`,
};

/**
 * This function performs a GraphQL query with the given query and variables.  
 * @function query
 * @async
 * @param {String} query The GraphQL query to send to the server.
 * @param {(Object|String)} variables The variables to include in the query.
 * @returns {Promise<Object>} - The response from the server.
 */
const query = async (query, variables) => {
	const res = await req(`https://replit.com/graphql?e=${Math.round(Math.random() * 100)}`, {
		headers,
		method: 'POST',
		body: JSON.stringify({ query, variables }),
	});
	return await res.json();
}

const emitters = [];
let counter = 0,
	msgs = [],
	ws;

/**
 * This function performs a GraphQL subscription with the given subscription and variables.  
 * @function subscribe
 * @async
 * @param {String} subscription The GraphQL subscription to send to the server.
 * @param {(Object|String)} variables The variables to include in the subscription.
 * @returns {EventEmitter}
 * @emits {data} Emitted when the server sends data in response to the subscription.
 * @emits {end} Emitted when the subscription is unsubscribed from or otherwise completed.
 */
const subscribe = (subscription, variables) => {
	if (!ws) {
		ws = new WebSocket(
			`wss://replit.com/graphql_subscriptions`,
			'graphql-ws',
			{ headers },
		);

		ws.on('open', () => {
			ws.send('{"type":"connection_init","payload":{}}');
			for (let i = 0; i < msgs.length; i++)
				ws.send(msgs[i]);
			msgs = null;
		});

		ws.on('message', (data) => {
			const { id, type, payload } = JSON.parse(data);
			const emitter = emitters[id];
			if (!emitter) return;

			if (type === 'data') emitter.emit('data', payload);
			else if (type === 'complete') emitter.unsubscribe();
		});
	}

	const sub = new EventEmitter();
	emitters.push(sub);
	const id = counter++;

	sub.unsubscribe = () => {
		ws.send(`{"id":"${id}","type":"stop"}`);
		sub.emit('end');
		emitters[id] = null;
	}

	const msg = JSON.stringify({
		type: 'start',
		id,
		payload: {
			variables,
			query: subscription,
		}
	});

	if (ws.readyState !== 1)
		msgs.push(msg);
	else
		ws.send(msg);

	return sub;
}

/**
 * This function edits the SID used for graphql.
 * @function setSid
 * @param {String} sid The SID used for graphql.
 * @returns {undefined}
 */
const setSid = (sid) => headers.cookie = `connect.sid=${sid}`;

module.exports = { query, subscribe, setSid };