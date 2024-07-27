import { StructureQueriesInterface } from '@strategies/postgres';

export class StructureQueries implements StructureQueriesInterface {
	from(table: string): string {
		return `FROM ${table} \n`;
	}
}