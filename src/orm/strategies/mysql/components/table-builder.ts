import { TableBuilderInterface } from '../interfaces';
import { DataSourceMySql } from '../data-source-mysql';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '../../../core';

export class TableBuilder implements TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourceMySql>,
		columns?: ColumnInterface<DataSourceMySql>[],
		computedColumns?: ComputedColumnInterface<DataSourceMySql>[]
	): string {
		let createTableSQL;
		console.log('POSTGRES');
		console.log('TABLE', table);
		console.log('COLUMN', columns);

		createTableSQL = `
                CREATE TABLE IF NOT EXISTS ${table.name} (
                    id INT AUTO_INCREMENT PRIMARY KEY
                );
            `;

		return createTableSQL;
	}
}