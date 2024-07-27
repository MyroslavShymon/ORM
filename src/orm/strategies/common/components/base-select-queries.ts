import { BaseSelectQueriesInterface } from '@strategies/common';

export class BaseSelectQueries implements BaseSelectQueriesInterface {
	limit(count: number): string {
		return `LIMIT ${count} \n`;
	}
}