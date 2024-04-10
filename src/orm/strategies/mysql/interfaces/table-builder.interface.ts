import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface[]
	): string;
}