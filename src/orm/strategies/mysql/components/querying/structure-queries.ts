import { StructureQueriesInterface } from '@strategies/common';

export class StructureQueries implements StructureQueriesInterface {
	from(table: string): string {
		return `FROM \`${table}\` \n`;
	}
}