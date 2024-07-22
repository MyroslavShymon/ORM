import { ViewQueriesInterface } from '@strategies/mysql';

export class ViewQueries implements ViewQueriesInterface {
	createView(name: string): string {
		return `CREATE VIEW \\\`${name}\\\` AS \n`;
	}
}