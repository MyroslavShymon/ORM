import { AlterTableResultInterface, TableManipulationInterface } from '@context/common';
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
	DropTableInterface,
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
			addColumn: this._addColumn(tableName, getQueryString),
			deleteColumn: this._deleteColumn(tableName, getQueryString),
			addDefaultValue: this._addDefaultValue(tableName, getQueryString),
			dropDefaultValue: this._dropDefaultValue(tableName, getQueryString),
			changeDataTypeOfColumn: this._changeDataTypeOfColumn(tableName, getQueryString),
			renameColumn: this._renameColumn(tableName, getQueryString),
			renameTable: this._renameTable(tableName, getQueryString),
			addNotNullToColumn: this._addNotNullToColumn(tableName, getQueryString),
			dropNotNullFromColumn: this._dropNotNullFromColumn(tableName, getQueryString),
			addUniqueToColumn: this._addUniqueToColumn(tableName, getQueryString),
			dropTable: this._dropTable(tableName, getQueryString)
		};
	};

	private _addColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: AddColumnInterface<DataSourceInterface>): Promise<Object | string> => {
		try {
			const addColumnQuery = this._dataSource.addColumn(tableName, parameters);
			if (getQueryString) {
				return addColumnQuery;
			}
			console.log('Add column Sql ', addColumnQuery);
			return this._dataSource.client.query(addColumnQuery);
		} catch (error) {
			console.error(`Error while adding column: ${error}`);
		}
	};

	private _deleteColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: DeleteColumnInterface<DataSourceInterface>): Promise<Object | string> => {
		try {
			const deleteColumnQuery = this._dataSource.deleteColumn(tableName, parameters);
			if (getQueryString) {
				return deleteColumnQuery;
			}
			console.log('Delete column Sql ', deleteColumnQuery);
			return this._dataSource.client.query(deleteColumnQuery);
		} catch (error) {
			console.error(`Error while deleting column: ${error}`);
		}
	};

	private _addDefaultValue = (tableName: string, getQueryString: boolean = false) => async (parameters: AddDefaultValueInterface): Promise<Object | string> => {
		try {
			const addDefaultValueQuery = this._dataSource.addDefaultValue(tableName, parameters);
			if (getQueryString) {
				return addDefaultValueQuery;
			}
			console.log('Add default value Sql ', addDefaultValueQuery);
			return this._dataSource.client.query(addDefaultValueQuery);
		} catch (error) {
			console.error(`Error while adding default value: ${error}`);
		}
	};

	private _dropDefaultValue = (tableName: string, getQueryString: boolean = false) => async (parameters: DropDefaultValueInterface): Promise<Object | string> => {
		try {
			const dropDefaultValueQuery = this._dataSource.dropDefaultValue(tableName, parameters);
			if (getQueryString) {
				return dropDefaultValueQuery;
			}
			console.log('Drop default value Sql ', dropDefaultValueQuery);
			return this._dataSource.client.query(dropDefaultValueQuery);
		} catch (error) {
			console.error(`Error while dropping default value: ${error}`);
		}
	};

	private _changeDataTypeOfColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: ChangeColumnDatatypeInterface): Promise<Object | string> => {
		try {
			const changeDataTypeOfColumnQuery = this._dataSource.changeDataTypeOfColumn(tableName, parameters);
			if (getQueryString) {
				return changeDataTypeOfColumnQuery;
			}
			console.log('Change datatype of column Sql ', changeDataTypeOfColumnQuery);
			return this._dataSource.client.query(changeDataTypeOfColumnQuery);
		} catch (error) {
			console.error(`Error while changing datatype of column: ${error}`);
		}
	};

	private _renameColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: RenameColumnInterface): Promise<Object | string> => {
		try {
			const renameColumnQuery = this._dataSource.renameColumn(tableName, parameters);
			if (getQueryString) {
				return renameColumnQuery;
			}
			console.log('Rename column Sql ', renameColumnQuery);
			return this._dataSource.client.query(renameColumnQuery);
		} catch (error) {
			console.error(`Error renaming column: ${error}`);
		}
	};

	private _renameTable = (tableName: string, getQueryString: boolean = false) => async (parameters: RenameTableInterface): Promise<Object | string> => {
		try {
			const renameTableQuery = this._dataSource.renameTable(tableName, parameters);
			if (getQueryString) {
				return renameTableQuery;
			}
			console.log('Rename table Sql ', renameTableQuery);
			return this._dataSource.client.query(renameTableQuery);
		} catch (error) {
			console.error(`Error while renaming table: ${error}`);
		}
	};

	private _addNotNullToColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: AddNotNullToColumnInterface<DataSourceInterface>): Promise<Object | string> => {
		try {
			const addNotNullToColumnQuery = this._dataSource.addNotNullToColumn(tableName, parameters);
			if (getQueryString) {
				return addNotNullToColumnQuery;
			}
			console.log('Add NotNull to column Sql ', addNotNullToColumnQuery);
			return this._dataSource.client.query(addNotNullToColumnQuery);
		} catch (error) {
			console.error(`Error while adding NotNull to column: ${error}`);
		}
	};

	private _dropNotNullFromColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: DropNotNullFromColumnInterface<DataSourceInterface>): Promise<Object | string> => {
		try {
			const dropNotNullFromColumnQuery = this._dataSource.dropNotNullFromColumn(tableName, parameters);
			if (getQueryString) {
				return dropNotNullFromColumnQuery;
			}
			console.log('Drop NotNull from column Sql ', dropNotNullFromColumnQuery);
			return this._dataSource.client.query(dropNotNullFromColumnQuery);
		} catch (error) {
			console.error(`Error while dropping NotNull from column: ${error}`);
		}
	};

	private _addUniqueToColumn = (tableName: string, getQueryString: boolean = false) => async (parameters: AddUniqueToColumnInterface<DataSourceInterface>): Promise<Object | string> => {
		try {
			const addUniqueToColumnQuery = this._dataSource.addUniqueToColumn(tableName, parameters);
			if (getQueryString) {
				return addUniqueToColumnQuery;
			}
			console.log('Add unique to column Sql ', addUniqueToColumnQuery);
			return this._dataSource.client.query(addUniqueToColumnQuery);
		} catch (error) {
			console.error(`Error while adding unique to column: ${error}`);
		}
	};

	private _dropTable = (tableName: string, getQueryString: boolean = false) => async (parameters: DropTableInterface): Promise<Object | string> => {
		try {
			const dropTableQuery = this._dataSource.dropTable(tableName, parameters);
			if (getQueryString) {
				return dropTableQuery;
			}
			console.log('Drop table Sql', dropTableQuery);
			return this._dataSource.client.query(dropTableQuery);
		} catch (error) {
			console.error(`Error while dropping table Sql: ${error}`);
		}
	};
}