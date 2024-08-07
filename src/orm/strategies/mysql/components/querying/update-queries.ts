import { UpdateQueriesInterface } from '@strategies/common';

export class UpdateQueries implements UpdateQueriesInterface {
	update(values: Partial<Object>, tableName: string): string {
		const setClause = Object.entries(values)
			.map(([column]) => `\`${column}\` = ?`)
			.join(', ');

		return `UPDATE \`${tableName}\`
                SET ${setClause}   `;
	}

}