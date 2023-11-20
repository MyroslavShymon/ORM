import { DataSourceMySql } from '../data-source-mysql';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '../../../core';

export interface TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourceMySql>,
		columns?: ColumnInterface<DataSourceMySql>[],
		computedColumns?: ComputedColumnInterface<DataSourceMySql>[]
	): string;
}