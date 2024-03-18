import { DataSourcePostgres } from '@strategies/postgres';

export interface AddUniqueToColumnInterface<DB> {
	columnName: string;
	constraintName?: DB extends DataSourcePostgres ? string : never;
}