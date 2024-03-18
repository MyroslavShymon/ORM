import { DeleteQueriesInterface } from '@strategies/mysql';

export class DeleteQueries implements DeleteQueriesInterface {
	deleting(tableName: string): string {
		return `DELETE FROM \`${tableName}\` \n`;
	}
}