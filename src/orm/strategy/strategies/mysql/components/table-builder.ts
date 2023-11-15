import { TableBuilderInterface } from '../interfaces';
import { ColumnInterface, TableInterface } from '../../../../interfaces';
import { ComputedColumnInterface } from '../../../../interfaces/decorators/computed-column';

export class TableBuilder implements TableBuilderInterface {
	createTable(table?: TableInterface, columns?: ColumnInterface[], computedColumns?: ComputedColumnInterface[]): string {
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