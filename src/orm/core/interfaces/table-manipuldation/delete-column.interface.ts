import { DataSourcePostgres } from '@strategies/postgres';

export interface DeleteColumnInterface<DB> {
	columnName: string,
	isCascade: DB extends DataSourcePostgres ? boolean : never;
}