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