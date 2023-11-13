import { AddColumnInterface, AlterTableResultInterface, TableManipulationInterface } from './interfaces';
import { ConnectionData } from './types';
import { DataSourceContext } from './data-source-context';

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