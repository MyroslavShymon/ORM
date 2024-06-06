import { DataSourcePostgres } from '@strategies/postgres';
import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableOptionsMysqlInterface,
	TableOptionsPostgresqlInterface
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
	oneToOne: OneToOneInterface[];
	oneToMany: OneToManyInterface[];
	manyToMany: ManyToManyInterface[];
}