import {
	ColumnInterface,
	ComputedColumnInterface,
	ForeignKeyInterface,
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
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;
}