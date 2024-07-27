import { StructureQueriesInterface } from '@strategies/mysql';

export class StructureQueries implements StructureQueriesInterface {
	from(table: string): string {
		return `FROM \`${table}\` \n`;
	}
}