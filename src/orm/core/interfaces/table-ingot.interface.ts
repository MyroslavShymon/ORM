import { DataSourcePostgres } from '@strategies/postgres';
import {
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface,
	TableOptionsPostgresqlInterface
} from '@decorators/postgres';
import { TableOptionsMysqlInterface } from '@decorators/mysql';
import { ColumnInterface, ComputedColumnInterface } from '@core/interfaces/decorators';

export interface TableIngotInterface<DB> {
	id: string;
	name: string;
	options?: DB extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
	columns: ColumnInterface<DB>[];
	computedColumns: ComputedColumnInterface<DB>[];
	foreignKeys: ForeignKeyInterface[];
	primaryColumn: PrimaryGeneratedColumnInterface;
}