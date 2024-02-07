import { ViewQueriesInterface } from '@strategies/postgres';

export class ViewQueries implements ViewQueriesInterface {
	createView(name: string): string {
		return `CREATE VIEW ${name} AS \n`;
	}

}