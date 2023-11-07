import { ColumnInterface, DataSourceInterface, TableInterface } from './interfaces';
import { ConnectionData } from './types';
import { Connection, createConnection } from 'mysql2/promise';

export class DataSourceMySql implements DataSourceInterface {
	client: Connection;

	async connect(dataToConnect: ConnectionData): Promise<void> {
		this.client = await createConnection(dataToConnect);
	}

	createTable(table: TableInterface, columns: ColumnInterface[]): string {
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