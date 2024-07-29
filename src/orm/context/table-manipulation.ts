import { AlterTableResultInterface, TableManipulationInterface } from '@context/common';
import {
	AddCheckConstraintToColumnInterface,
	AddColumnInterface,
	AddComputedColumnInterface,
	AddDefaultValueInterface,
	AddForeignKeyInterface,
	AddNotNullToColumnInterface,
	AddPrimaryGeneratedColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DataSourceInterface,
	DeleteCheckConstraintOfColumnInterface,
	DeleteColumnInterface,
	DeleteUniqueFromColumnInterface,
	DropConstraintInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	DropTableInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces';
import { DatabasesTypes } from '@core/enums';
import { Sanitizer } from '@utils/sanitizer';
import { ConnectionData } from '@core/types';

export class TableManipulation<DT extends DatabasesTypes> implements TableManipulationInterface<DT> {
	private _dataSource: DataSourceInterface<DT>;
	private readonly _connectionData: ConnectionData;

	constructor(dataSource: DataSourceInterface<DT>, connectionData: ConnectionData) {
		this._dataSource = dataSource;
		this._connectionData = connectionData;
	}

	alterTable = (tableName: string, getQueryString: boolean): AlterTableResultInterface<DT> => {
		if (this._connectionData.sanitizer)
			Sanitizer.sanitize(tableName, 'identifier');
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
			dropTable: this._dropTable(tableName, getQueryString),
			addCheckConstraintToColumn: this._addCheckConstraintToColumn(tableName, getQueryString),
			deleteCheckConstraintOfColumn: this._deleteCheckConstraintOfColumn(tableName, getQueryString),
			deleteUniqueFromColumn: this._deleteUniqueFromColum(tableName, getQueryString),
			dropConstraint: this._dropConstraint(tableName, getQueryString),
			addPrimaryGeneratedColumn: this._addPrimaryGeneratedColumn(tableName, getQueryString),
			addForeignKey: this._addForeignKey(tableName, getQueryString),
			addComputedColumn: this._addComputedColumn(tableName, getQueryString)
		};
	};

	private _addColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddColumnInterface<DT>): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _deleteColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DeleteColumnInterface<DT>): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _addDefaultValue = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddDefaultValueInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _dropDefaultValue = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DropDefaultValueInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _changeDataTypeOfColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: ChangeColumnDatatypeInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _renameColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: RenameColumnInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer) {
					Sanitizer.sanitize(parameters.columnName, 'identifier');
					Sanitizer.sanitize(parameters.futureColumnName, 'identifier');
				}
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

	private _renameTable = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: RenameTableInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.tableName, 'identifier');
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

	private _addNotNullToColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddNotNullToColumnInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _dropNotNullFromColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DropNotNullFromColumnInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _addUniqueToColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddUniqueToColumnInterface<DT>): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
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

	private _addCheckConstraintToColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddCheckConstraintToColumnInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
				const addCheckConstraintToColumnQuery = this._dataSource.addCheckConstraintToColumn(tableName, parameters);
				if (getQueryString) {
					return addCheckConstraintToColumnQuery;
				}
				console.log('Add check constraint to column Sql ', addCheckConstraintToColumnQuery);
				return this._dataSource.client.query(addCheckConstraintToColumnQuery);
			} catch (error) {
				console.error(`Error while adding check constraint to column: ${error}`);
			}
		};

	private _deleteCheckConstraintOfColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DeleteCheckConstraintOfColumnInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
				const deleteCheckConstraintOfColumnQuery = this._dataSource.deleteCheckConstraintOfColumn(tableName, parameters);
				if (getQueryString) {
					return deleteCheckConstraintOfColumnQuery;
				}
				console.log('Delete check constraint of column Sql ', deleteCheckConstraintOfColumnQuery);
				return this._dataSource.client.query(deleteCheckConstraintOfColumnQuery);
			} catch (error) {
				console.error(`Error while deleting check constraint of column: ${error}`);
			}
		};


	private _dropConstraint = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DropConstraintInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.constraintName, 'identifier');
				const dropConstraintQuery = this._dataSource.dropConstraint(tableName, parameters);
				if (getQueryString) {
					return dropConstraintQuery;
				}
				console.log('Drop constraint of column Sql ', dropConstraintQuery);
				return this._dataSource.client.query(dropConstraintQuery);
			} catch (error) {
				console.error(`Error while dropping constraint of column: ${error}`);
			}
		};

	private _deleteUniqueFromColum = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DeleteUniqueFromColumnInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
				const deleteUniqueFromColumnQuery = this._dataSource.deleteUniqueFromColum(tableName, parameters);
				if (getQueryString) {
					return deleteUniqueFromColumnQuery;
				}
				console.log('Delete unique constraint of column Sql ', deleteUniqueFromColumnQuery);
				return this._dataSource.client.query(deleteUniqueFromColumnQuery);
			} catch (error) {
				console.error(`Error while deleting unique constraint of column: ${error}`);
			}
		};

	private _addPrimaryGeneratedColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddPrimaryGeneratedColumnInterface<DT>): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.columnName, 'identifier');
				const addPrimaryGeneratedColumnQuery = this._dataSource.addPrimaryGeneratedColumn(tableName, parameters);
				if (getQueryString) {
					return addPrimaryGeneratedColumnQuery;
				}
				console.log('Add primary generated to column Sql ', addPrimaryGeneratedColumnQuery);
				return this._dataSource.client.query(addPrimaryGeneratedColumnQuery);
			} catch (error) {
				console.error(`Error while adding primary generated to column: ${error}`);
			}
		};

	private _addForeignKey = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddForeignKeyInterface): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer) {
					Sanitizer.sanitize(parameters.referencedTable, 'identifier');
					Sanitizer.sanitize(parameters.referencedColumn, 'identifier');
					Sanitizer.sanitize(parameters.foreignKey, 'identifier');
				}
				const addForeignKey = this._dataSource.addForeignKey(tableName, parameters);
				if (getQueryString) {
					return addForeignKey;
				}
				console.log('Add foreign key to column Sql ', addForeignKey);
				return this._dataSource.client.query(addForeignKey);
			} catch (error) {
				console.error(`Error while adding foreign key to column: ${error}`);
			}
		};

	private _addComputedColumn = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: AddComputedColumnInterface<DT>): Promise<Object | string> => {
			try {
				if (this._connectionData.sanitizer)
					Sanitizer.sanitize(parameters.name, 'identifier');
				const addComputedColumn = this._dataSource.addComputedColumn(tableName, parameters);
				if (getQueryString) {
					return addComputedColumn;
				}
				console.log('Add computed column Sql ', addComputedColumn);
				return this._dataSource.client.query(addComputedColumn);
			} catch (error) {
				console.error(`Error while adding computed column: ${error}`);
			}
		};

	private _dropTable = (tableName: string, getQueryString: boolean = false) =>
		async (parameters: DropTableInterface<DT>): Promise<Object | string> => {
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