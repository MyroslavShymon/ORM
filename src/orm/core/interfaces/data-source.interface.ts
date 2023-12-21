import { ConnectionData } from '@core/types';
import { ColumnInterface, ComputedColumnInterface, TableInterface } from '@core/interfaces/decorators';
import { AddColumnInterface } from '@core/interfaces/table-manipuldation/add-column.interface';
import {
	TableAltererInterface as TableAltererInterfacePostgres,
	TableBuilderInterface as TableBuilderInterfacePostgres
} from '../../strategies/postgres';
import {
	TableAltererInterface as TableAltererInterfaceMysql,
	TableBuilderInterface as TableBuilderInterfaceMysql
} from '../../strategies/mysql';
import { DatabaseIngotInterface } from '@core/interfaces/database-ingot.interface';
import {
	AddDefaultValueInterface,
	AddNotNullToColumnInterface,
	AddUniqueToColumnInterface,
	ChangeColumnDatatypeInterface,
	DeleteColumnInterface,
	DropDefaultValueInterface,
	DropNotNullFromColumnInterface,
	RenameColumnInterface,
	RenameTableInterface
} from '@core/interfaces/table-manipuldation';
import { ForeignKeyInterface, PrimaryGeneratedColumnInterface } from '@decorators/postgres';

export interface DataSourceInterface {
	client;//TODO typing
	tableBuilder: TableBuilderInterfacePostgres | TableBuilderInterfaceMysql;
	tableAlterer: TableAltererInterfacePostgres | TableAltererInterfaceMysql;

	connect(dataToConnect: ConnectionData);

	createTable(
		table?: TableInterface<DataSourceInterface>,
		columns?: ColumnInterface<DataSourceInterface>[],
		computedColumns?: ComputedColumnInterface<DataSourceInterface>[],
		foreignKeys?: ForeignKeyInterface[],
		primaryColumn?: PrimaryGeneratedColumnInterface
	): string;

	addColumn(tableName: string, parameters: AddColumnInterface<DataSourceInterface>): string;

	deleteColumn(tableName: string, parameters: DeleteColumnInterface): string;

	addDefaultValue(tableName: string, parameters: AddDefaultValueInterface): string;

	dropDefaultValue(tableName: string, parameters: DropDefaultValueInterface): string;

	changeDataTypeOfColumn(tableName: string, parameters: ChangeColumnDatatypeInterface): string;

	renameColumn(tableName: string, parameters: RenameColumnInterface): string;

	renameTable(tableName: string, parameters: RenameTableInterface): string;

	addNotNullToColumn(tableName: string, parameters: AddNotNullToColumnInterface): string;

	dropNotNullFromColumn(tableName: string, parameters: DropNotNullFromColumnInterface): string;

	addUniqueToColumn(tableName: string, parameters: AddUniqueToColumnInterface): string;

	createMigrationTable(tableName: string, tableSchema: string): string;

	checkTableExistence(dataSource: DataSourceInterface, tableName: string, tableSchema: string): Promise<boolean>;

	initCurrentDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void>;

	syncDatabaseIngot(
		dataSource: DataSourceInterface,
		tableName: string,
		tableSchema: string,
		databaseIngot: DatabaseIngotInterface
	): Promise<void>;

	getCurrentTimestamp(): string;
}
