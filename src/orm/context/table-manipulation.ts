import { AlterTableResultInterface, TableManipulationInterface } from '@context/interfaces';
import {
	AddColumnInterface,
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DataSourceInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';

export class TableManipulation implements TableManipulationInterface {
	private _dataSource: DataSourceInterface;

	constructor(dataSource: DataSourceInterface) {
		this._dataSource = dataSource;
	}

	alterTable = (tableName: string, getQueryString: boolean): AlterTableResultInterface<DataSourceInterface> => {
		return {
			addColumn: this.addColumn(tableName, getQueryString),
			deleteColumn: this.deleteColumn(tableName, getQueryString),
			addDefaultValue: this.addDefaultValue(tableName, getQueryString),
			dropDefaultValue: this.dropDefaultValue(tableName, getQueryString),
			changeDataTypeOfColumn: this.changeDataTypeOfColumn(tableName, getQueryString),
			renameColumn: this.renameColumn(tableName, getQueryString),
			renameTable: this.renameTable(tableName, getQueryString),
			addNotNullToColumn: this.addNotNullToColumn(tableName, getQueryString),
			dropNotNullFromColumn: this.dropNotNullFromColumn(tableName, getQueryString),
			addUniqueToColumn: this.addUniqueToColumn(tableName, getQueryString)
		};
	};

	addColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: AddColumnInterface<DataSourceInterface>): Promise<Object | string> => {
		const addColumnQuery = this._dataSource.addColumn(tableName, parameters);
		if (getQueryString) {
			return addColumnQuery;
		}
		console.log('Add column Sql ', addColumnQuery);
		return this._dataSource.client.query(addColumnQuery);
	};

	deleteColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: DeleteColumnInterface): Promise<Object | string> => {
		const deleteColumnQuery = this._dataSource.deleteColumn(tableName, parameters);
		if (getQueryString) {
			return deleteColumnQuery;
		}
		console.log('Delete column Sql ', deleteColumnQuery);
		return this._dataSource.client.query(deleteColumnQuery);
	};

	addDefaultValue = (tableName: string, getQueryString: boolean = false) => async (parameters: AddDefaultValueInterface): Promise<Object | string> => {
		const addDefaultValueQuery = this._dataSource.addDefaultValue(tableName, parameters);
		if (getQueryString) {
			return addDefaultValueQuery;
		}
		console.log('Add default value Sql ', addDefaultValueQuery);
		return this._dataSource.client.query(addDefaultValueQuery);
	};

	dropDefaultValue = (tableName: string, getQueryString: boolean = false) => async (parameters: DropDefaultValueInterface): Promise<Object | string> => {
		const dropDefaultValueQuery = this._dataSource.dropDefaultValue(tableName, parameters);
		if (getQueryString) {
			return dropDefaultValueQuery;
		}
		console.log('Drop default value Sql ', dropDefaultValueQuery);
		return this._dataSource.client.query(dropDefaultValueQuery);
	};

	changeDataTypeOfColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: ChangeColumnDatatypeInterface): Promise<Object | string> => {
		const changeDataTypeOfColumnQuery = this._dataSource.changeDataTypeOfColumn(tableName, parameters);
		if (getQueryString) {
			return changeDataTypeOfColumnQuery;
		}
		console.log('Change datatype of column Sql ', changeDataTypeOfColumnQuery);
		return this._dataSource.client.query(changeDataTypeOfColumnQuery);
	};

	renameColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: RenameColumnInterface): Promise<Object | string> => {
		const renameColumnQuery = this._dataSource.renameColumn(tableName, parameters);
		if (getQueryString) {
			return renameColumnQuery;
		}
		console.log('Rename column Sql ', renameColumnQuery);
		return this._dataSource.client.query(renameColumnQuery);
	};

	renameTable = (tableName: string, getQueryString: boolean = false) => async (parameters: RenameTableInterface): Promise<Object | string> => {
		const renameTableQuery = this._dataSource.renameTable(tableName, parameters);
		if (getQueryString) {
			return renameTableQuery;
		}
		console.log('Rename table Sql ', renameTableQuery);
		return this._dataSource.client.query(renameTableQuery);
	};

	addNotNullToColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: AddNotNullToColumnInterface): Promise<Object | string> => {
		const addNotNullToColumnQuery = this._dataSource.addNotNullToColumn(tableName, parameters);
		if (getQueryString) {
			return addNotNullToColumnQuery;
		}
		console.log('Add NotNull to column Sql ', addNotNullToColumnQuery);
		return this._dataSource.client.query(addNotNullToColumnQuery);
	};

	dropNotNullFromColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: DropNotNullFromColumnInterface): Promise<Object | string> => {
		const dropNotNullFromColumnQuery = this._dataSource.dropNotNullFromColumn(tableName, parameters);
		if (getQueryString) {
			return dropNotNullFromColumnQuery;
		}
		console.log('Drop NotNull from column Sql ', dropNotNullFromColumnQuery);
		return this._dataSource.client.query(dropNotNullFromColumnQuery);
	};

	addUniqueToColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: AddUniqueToColumnInterface): Promise<Object | string> => {
		const addUniqueToColumnQuery = this._dataSource.addUniqueToColumn(tableName, parameters);
		if (getQueryString) {
			return addUniqueToColumnQuery;
		}
		console.log('Add unique to column Sql ', addUniqueToColumnQuery);
		return this._dataSource.client.query(addUniqueToColumnQuery);
	};
}