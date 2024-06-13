import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	ManyToManyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DatabasesTypes.POSTGRES>,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>,
		oneToOne?: OneToOneInterface[],
		oneToMany?: OneToManyInterface[],
		manyToMany?: ManyToManyInterface[]
	): string;
}