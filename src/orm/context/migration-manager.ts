import { DataSourceInterface } from '@core/interfaces';
import { MigrationManagerInterface } from '@context/interfaces/migration-manager.interface';

export class MigrationManager implements MigrationManagerInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	async createMigrationTable(): Promise<void> {
		const createMigrationTableQuery = this._dataSource.createMigrationTable();
		console.log('Create migration table Sql query', createMigrationTableQuery);
		return this._dataSource.client.query(createMigrationTableQuery);
	}

	async checkTableExistence(tableName: string, tableSchema?: string): Promise<boolean> {
		return this._dataSource.checkTableExistence(this._dataSource, tableName, tableSchema);
	}

	insertIntoMigrationTable() {
	}

	updateMigrationTable() {
	}
}