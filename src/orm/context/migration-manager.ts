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
		const checkTableExistenceQuery = this._dataSource.checkTableExistence(tableName, tableSchema);
		console.log('Check table existence Sql query', checkTableExistenceQuery);
		return this._dataSource.client.query(checkTableExistenceQuery);
	}

	insertIntoMigrationTable() {
	}

	updateMigrationTable() {
	}
}