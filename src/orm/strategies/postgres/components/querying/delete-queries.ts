import { DeleteQueriesInterface } from '@strategies/common';

export class DeleteQueries implements DeleteQueriesInterface {
	deleting(tableName: string): string {
		return `DELETE FROM ${tableName} \n`;
	}
}