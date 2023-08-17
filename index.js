{
const isNode = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
	
let EventEmitter;
if (isNode) {
	const events = require('events');
	EventEmitter = events.EventEmitter;
	var WebSocket = require('ws');
} else {
	EventEmitter = class extends EventTarget {
		emit(name, { data }) {
			const event = new Event(name);
			event.data = data;
			this.dispatchEvent(event);
		}
		on(eventName, listener) {
			return this.addEventListener(eventName, listener);
		}
	}
}

const headers = {
	'user-agent': 'replit',
	'connection': 'keep-alive',
	'referrer': 'https://replit.com',
	'content-type': 'application/json',
	'x-requested-with': 'XMLHttpRequest',
};

/**
 * This function performs a GraphQL query with the given query and variables.  
 * @function query
 * @async
 * @param {string} query The GraphQL query to send to the server.
 * @param {object} [config] Configuration options.
 * @param {(object|string)} config.variables={} The variables to include in the query.
 * @param {boolean} config.raw=false Returns response as text.
 * @returns {Promise<object|string>} The response from the server.
 */
const query = async (query, config = {}) => {
	const { variables = {}, raw = false } = config;
	const res = await fetch(`https://replit.com/graphql?e=${Math.round(Math.random() * 100)}`, {
		headers,
		method: 'POST',
		body: JSON.stringify({ query, variables }),
	});
	return raw ? res.text() : res.json();
}

const emitters = [];
let counter = 0,
	msgs = [],
	ws;

/**
 * This function performs a GraphQL subscription with the given subscription and variables.  
 * @function subscribe
 * @async
 * @param {string} subscription The GraphQL subscription to send to the server.
 * @param {object} [config] Configuration options.
 * @param {(object|string)} config.variables={} The variables to include in the subscription.
 * @returns {EventEmitter}
 * @emits {data} Emitted when the server sends data in response to the subscription.
 * @emits {end} Emitted when the subscription is unsubscribed from or otherwise completed.
 */
const subscribe = (subscription, config = {}) => {
	const { variables = {} } = config;
	if (!ws) {
		ws = new WebSocket(
			`wss://replit.com/graphql_subscriptions`,
			'graphql-ws',
			{ headers },
		);

		ws.addEventListener('open', () => {
			ws.send('{"type":"connection_init","payload":{}}');
			for (let i = 0; i < msgs.length; i++)
				ws.send(msgs[i]);
			msgs = null;
		});

		ws.addEventListener('message', ({ data }) => {
			const { id, type, payload } = JSON.parse(data);
			const emitter = emitters[id];
			if (!emitter) return;

			if (type === 'data') emitter.emit('data', { data: payload });
			else if (type === 'complete') emitter.unsubscribe();
		});
	}

	const sub = new EventEmitter();
	const id = counter++;
	emitters.push(sub);

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

	if (ws.readyState !== 1) {
		msgs.push(msg);
	} else {
		ws.send(msg);
	}

	return sub;
}

/**
 * This function edits the SID used for graphql.
 * @function setSid
 * @param {string} sid The SID used for graphql.
 */
const setSid = (sid) => {
	headers.cookie = `connect.sid=${sid}`
};
	
if (isNode && process.env.SID) setSid(process.env.SID);

const replit = { query, subscribe, setSid };

if (isNode) {
	module.exports = replit;
} else {
	window.replit = replit;
}
}