import { UpdateQueriesInterface } from '@strategies/postgres';

export class UpdateQueries implements UpdateQueriesInterface {
	update(values: Partial<Object>, tableName: string): string {
		const setClause = Object.entries(values)
			.map(([column, value]) => `${column} = '${value}'`)
			.join(', ');

		return `UPDATE ${tableName} SET ${setClause} \n`;
	}

}