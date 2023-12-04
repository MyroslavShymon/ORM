import { AlterTableResultInterface, TableManipulationInterface } from '@context/interfaces';
import { AddColumnInterface, DataSourceInterface } from '@core/interfaces';

export class TableManipulation implements TableManipulationInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	alterTable = (tableName: string): AlterTableResultInterface<DataSourceInterface> => {
		return {
			addColumn: this.addColumn(tableName)
		};
	};

	addColumn = (tableName: string) => async (parameters: AddColumnInterface<DataSourceInterface>): Promise<Object> => {
		const addColumnQuery = this._dataSource.addColumn(tableName, parameters);
		console.log('Add column Sql ', addColumnQuery);
		return this._dataSource.client.query(addColumnQuery);
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