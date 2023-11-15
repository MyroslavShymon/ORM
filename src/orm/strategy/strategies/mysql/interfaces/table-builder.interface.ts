import { ColumnInterface, TableInterface } from '../../../../interfaces';
import { ComputedColumnInterface } from '../../../../interfaces/decorators/computed-column';

export interface TableBuilderInterface {
	createTable(table?: TableInterface, columns?: ColumnInterface[], computedColumns?: ComputedColumnInterface[]): string;
}