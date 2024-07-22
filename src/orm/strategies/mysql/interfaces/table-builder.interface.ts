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
		table?: TableInterface<DatabasesTypes.MYSQL>,
		columns?: ColumnInterface<DatabasesTypes.MYSQL>[],
		computedColumns?: ComputedColumnInterface<DatabasesTypes.MYSQL>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface<DatabasesTypes.MYSQL>,
		oneToOne?: OneToOneInterface[],
		oneToMany?: OneToManyInterface[]
	): string;
}