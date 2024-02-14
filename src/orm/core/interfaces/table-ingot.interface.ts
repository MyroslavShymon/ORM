import { DataSourcePostgres } from '@strategies/postgres';
import {
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface,
	TableOptionsPostgresqlInterface
} from '@decorators/postgres';
import { TableOptionsMysqlInterface } from '@decorators/mysql';
import { ColumnInterface, ComputedColumnInterface } from '@core/interfaces/decorators';

//TODO зробити так шоб всі поля в TableIngotInterface<DB> окрім id і name були опціональними і нічого не зламалось
export interface TableIngotInterface<DB> {
	id?: string;
	name: string;
	options?: DB extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
	columns: ColumnInterface<DB>[];
	computedColumns: ComputedColumnInterface<DB>[];
	foreignKeys: ForeignKeyInterface[];
	primaryColumn: PrimaryGeneratedColumnInterface;
}