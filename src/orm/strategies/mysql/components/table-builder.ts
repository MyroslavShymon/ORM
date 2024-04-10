import { DataSourceMySql, TableBuilderInterface } from '@strategies/mysql';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces';

export class TableBuilder implements TableBuilderInterface {
	createTable(
		table?: TableInterface<DataSourceMySql>,
		columns?: ColumnInterface[],
		computedColumns?: ComputedColumnInterface[]
	): string {
		let createTableQuery;

		createTableQuery = `\n\tCREATE TABLE IF NOT EXISTS ${table.name} (
                    id INT AUTO_INCREMENT PRIMARY KEY
                );
            `;

		return createTableQuery;
	}
}