import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableOptionsInterface
} from '@core/interfaces/decorators';
import { DatabasesTypes } from '@core/enums';

//TODO зробити так шоб всі поля в TableIngotInterface<DB> окрім id і name були опціональними і нічого не зламалось
export interface TableIngotInterface<DT extends DatabasesTypes> {
	id?: string;
	name: string;
	options?: TableOptionsInterface<DT>;
	columns: ColumnInterface<DT>[];
	computedColumns: ComputedColumnInterface<DT>[];
	foreignKeys: ForeignKeyInterface[];
	primaryColumn: PrimaryGeneratedColumnInterface<DT>;
	oneToOne: OneToOneInterface[];
	oneToMany: OneToManyInterface[];
	manyToMany: ManyToManyInterface[];
}