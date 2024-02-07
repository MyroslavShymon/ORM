import { BaseInsertQueriesInterface } from '@strategies/common';

export class BaseInsertQueries implements BaseInsertQueriesInterface {
	setInto(name: string): string {
		return ` INTO ${name} \n`;
	}
}