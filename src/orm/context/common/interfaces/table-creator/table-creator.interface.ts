import { DataSourceInterface } from '@core/interfaces';
import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { ConnectionData } from '@core/types';
import { ManyToManyRelationsOfTablesInterface } from '@context/common';

export interface TableCreatorInterface {
	createIngotOfTables(connectionData: ConnectionData): Promise<TableIngotInterface<DataSourceInterface>[] | undefined>;

	generateCreateTableQuery(ingotsOfTables: TableIngotInterface<DataSourceInterface>[]): string;

	generateCreateTableQueryForManyToManyRelation(manyToManyRelationsOfTables: ManyToManyRelationsOfTablesInterface[]): string;
}