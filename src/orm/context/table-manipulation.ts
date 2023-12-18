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

	alterTable = (tableName: string): AlterTableResultInterface<DataSourceInterface> => {
		return {
			addColumn: this.addColumn(tableName),
			deleteColumn: this.deleteColumn(tableName),
			addDefaultValue: this.addDefaultValue(tableName),
			dropDefaultValue: this.dropDefaultValue(tableName),
			changeDataTypeOfColumn: this.changeDataTypeOfColumn(tableName),
			renameColumn: this.renameColumn(tableName),
			renameTable: this.renameTable(tableName),
			addNotNullToColumn: this.addNotNullToColumn(tableName),
			dropNotNullFromColumn: this.dropNotNullFromColumn(tableName),
			addUniqueToColumn: this.addUniqueToColumn(tableName)
		};
	};

	addColumn = (tableName: string) => async (parameters: AddColumnInterface<DataSourceInterface>): Promise<Object> => {
		const addColumnQuery = this._dataSource.addColumn(tableName, parameters);
		console.log('Add column Sql ', addColumnQuery);
		return this._dataSource.client.query(addColumnQuery);
	};

	deleteColumn = (tableName: string) => async (parameters: DeleteColumnInterface): Promise<Object> => {
		const deleteColumnQuery = this._dataSource.deleteColumn(tableName, parameters);
		console.log('Delete column Sql ', deleteColumnQuery);
		return this._dataSource.client.query(deleteColumnQuery);
	};

	addDefaultValue = (tableName: string) => async (parameters: AddDefaultValueInterface): Promise<Object> => {
		const addDefaultValueQuery = this._dataSource.addDefaultValue(tableName, parameters);
		console.log('Add default value Sql ', addDefaultValueQuery);
		return this._dataSource.client.query(addDefaultValueQuery);
	};

	dropDefaultValue = (tableName: string) => async (parameters: DropDefaultValueInterface): Promise<Object> => {
		const dropDefaultValueQuery = this._dataSource.dropDefaultValue(tableName, parameters);
		console.log('Drop default value Sql ', dropDefaultValueQuery);
		return this._dataSource.client.query(dropDefaultValueQuery);
	};

	changeDataTypeOfColumn = (tableName: string) => async (parameters: ChangeColumnDatatypeInterface): Promise<Object> => {
		const changeDataTypeOfColumnQuery = this._dataSource.changeDataTypeOfColumn(tableName, parameters);
		console.log('Change datatype of column Sql ', changeDataTypeOfColumnQuery);
		return this._dataSource.client.query(changeDataTypeOfColumnQuery);
	};

	renameColumn = (tableName: string) => async (parameters: RenameColumnInterface): Promise<Object> => {
		const renameColumnQuery = this._dataSource.renameColumn(tableName, parameters);
		console.log('Rename column Sql ', renameColumnQuery);
		return this._dataSource.client.query(renameColumnQuery);
	};

	renameTable = (tableName: string) => async (parameters: RenameTableInterface): Promise<Object> => {
		const renameTableQuery = this._dataSource.renameTable(tableName, parameters);
		console.log('Rename table Sql ', renameTableQuery);
		return this._dataSource.client.query(renameTableQuery);
	};

	addNotNullToColumn = (tableName: string) => async (parameters: AddNotNullToColumnInterface): Promise<Object> => {
		const addNotNullToColumnQuery = this._dataSource.addNotNullToColumn(tableName, parameters);
		console.log('Add NotNull to column Sql ', addNotNullToColumnQuery);
		return this._dataSource.client.query(addNotNullToColumnQuery);
	};

	dropNotNullFromColumn = (tableName: string) => async (parameters: DropNotNullFromColumnInterface): Promise<Object> => {
		const dropNotNullFromColumnQuery = this._dataSource.dropNotNullFromColumn(tableName, parameters);
		console.log('Drop NotNull from column Sql ', dropNotNullFromColumnQuery);
		return this._dataSource.client.query(dropNotNullFromColumnQuery);
	};

	addUniqueToColumn = (tableName: string) => async (parameters: AddUniqueToColumnInterface): Promise<Object> => {
		const addUniqueToColumnQuery = this._dataSource.addUniqueToColumn(tableName, parameters);
		console.log('Add unique to column Sql ', addUniqueToColumnQuery);
		return this._dataSource.client.query(addUniqueToColumnQuery);
	};
}