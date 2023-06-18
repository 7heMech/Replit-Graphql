import { EventEmitter } from 'events';

declare module 'replit-graphql' {
	interface GraphQLConfig {
		variables?: Record<string, any>;
		raw?: boolean;
	}

	export function query(query: string, config?: GraphQLConfig): Promise<object>;

	export function subscribe(subscription: string, config?: GraphQLConfig): EventEmitter;

	export function setSid(sid: string): void;
}
