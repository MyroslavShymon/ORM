import { ViewQueriesInterface } from '@strategies/common';

export class ViewQueries implements ViewQueriesInterface {
	createView(name: string): string {
		return `CREATE VIEW \`${name}\` AS \n`;
	}
}