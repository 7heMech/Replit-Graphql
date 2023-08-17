import { EventEmitter } from 'events';

declare module 'replit-graphql' {
	interface GraphQLConfig {
		variables?: Record<string, any>;
		raw?: boolean;
	}

	interface GraphQLError {
		message: string;
		extensions: {
			code: string;
		};
	}

	interface GraphQLResponse<T> {
		data?: T;
		errors?: GraphQLError[];
	}
	/**
	 * This function performs a GraphQL query with the given query and variables.  
	 * @function query
	 * @async
	 * @param {string} query The GraphQL query to send to the server.
	 * @param {object} config Configuration options.
	 * @param {(object|string)} config.variables={} The variables to include in the query.
	 * @param {boolean} [config.raw=false] Returns response as text.
	 * @returns {Promise<object|string>} The response from the server.
	 */
	export function query<T>(query: string, config?: GraphQLConfig): Promise<GraphQLResponse<T>>;

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
	export function subscribe(subscription: string, config?: GraphQLConfig): EventEmitter;

	/**
	 * This function edits the SID used for graphql.
	 * @function setSid
	 * @param {string} sid The SID used for graphql.
	 */
	export function setSid(sid: string): void;
}