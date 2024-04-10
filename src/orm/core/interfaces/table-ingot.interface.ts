import { DataSourcePostgres } from '@strategies/postgres';
import { TableOptionsMysqlInterface, TableOptionsPostgresqlInterface } from '@decorators/index';
import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	PrimaryGeneratedColumnInterface
} from '@core/interfaces/decorators';

//TODO зробити так шоб всі поля в TableIngotInterface<DB> окрім id і name були опціональними і нічого не зламалось
export interface TableIngotInterface<DB> {
	id?: string;
	name: string;
	options?: DB extends DataSourcePostgres ? TableOptionsPostgresqlInterface : TableOptionsMysqlInterface;
	columns: ColumnInterface[];
	computedColumns: ComputedColumnInterface[];
	foreignKeys: ForeignKeyInterface[];
	primaryColumn: PrimaryGeneratedColumnInterface;
}