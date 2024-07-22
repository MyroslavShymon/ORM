import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
	OneToManyInterface,
	OneToOneInterface,
	PrimaryGeneratedColumnInterface,
	TableInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DatabasesTypes.POSTGRES>,
		columns?: ColumnInterface<DatabasesTypes.POSTGRES>[],
		computedColumns?: ComputedColumnInterface<DatabasesTypes.POSTGRES>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface<DatabasesTypes.POSTGRES>,
		oneToOne?: OneToOneInterface[],
		oneToMany?: OneToManyInterface[]
	): string;
}