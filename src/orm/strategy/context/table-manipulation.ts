import {
	AddColumnInterface,
	AlterTableResultInterface,
	DataSourceInterface,
	TableManipulationInterface
} from '../../interfaces';

export class TableManipulation implements TableManipulationInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	alterTable = (tableName: string): AlterTableResultInterface => {
		return {
			addColumn: this.addColumn(tableName)
		};
	};

	addColumn = (tableName: string) => async (parameters: AddColumnInterface): Promise<Object> => {
		const addColumnSql = this._dataSource.addColumn(tableName, parameters);
		console.log('Add column Sql ', addColumnSql);
		return this._dataSource.client.query(addColumnSql);
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