import { AddColumnInterface, AlterTableResultInterface, TableManipulationInterface } from './interfaces';
import { ConnectionData } from './types';
import { DataSourceContext } from './data-source-context';
import { DatabasesTypes } from './enums';
import { DataSourcePostgres } from './data-source-postgres';

export class TableManipulation implements TableManipulationInterface {
	_connectionData: ConnectionData;
	_dataSource: DataSourceContext;

	constructor(connectionData: ConnectionData, dataSource: DataSourceContext) {
		this._connectionData = connectionData;
		this._dataSource = dataSource;
	}

	alterTable = (tableName: string): AlterTableResultInterface => {
		return {
			addColumn: this.addColumn(tableName)
		};
	};

	addColumn = (tableName: string) => async (parameters: AddColumnInterface): Promise<void> => {
		if (this._connectionData.type === DatabasesTypes.POSTGRES) {
			this._dataSource.setDatabase(new DataSourcePostgres());
			console.log('aaaaaaaaaaaaaaaaa');
		}

		if (this._connectionData.type === DatabasesTypes.MYSQL) {
			this._dataSource.setDatabase(new DataSourcePostgres());
			console.log('bbbbbbbbbbbbbbbb');
		}
	};

	deleteColumn(parameters: {}) {
		return 'deleteColumn';
	}

	changeDefaultValue() {
		return 'changeDefaultValue';
	}

	changeDataTypeOfColumn() {
		return 'changeDataTypeOfColumn';
	}

	renameColumn() {
		return 'renameColumn';
	}

	renameTable() {
		return 'renameTable';
	}

	addConstraint() {
		return 'addConstraint';
	}

	deleteConstraint() {
		return 'deleteConstraint';
	}
}