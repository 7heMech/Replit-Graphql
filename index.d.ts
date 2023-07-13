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

	export function query<T>(query: string, config?: GraphQLConfig): Promise<GraphQLResponse<T>>;

	export function subscribe(subscription: string, config?: GraphQLConfig): EventEmitter;

	export function setSid(sid: string): void;
}