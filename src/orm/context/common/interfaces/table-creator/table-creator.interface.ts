import { TableIngotInterface } from '@core/interfaces/table-ingot.interface';
import { ConnectionData } from '@core/types';
import { ManyToManyRelationsOfTablesInterface } from '@context/common';
import { DatabasesTypes } from '@core/enums';

export interface TableCreatorInterface<DT extends DatabasesTypes> {
	createIngotOfTables(connectionData: ConnectionData): Promise<TableIngotInterface<DT>[] | undefined>;

	generateCreateTableQuery(ingotsOfTables: TableIngotInterface<DT>[]): string;

	generateCreateTableQueryForManyToManyRelation(manyToManyRelationsOfTables: ManyToManyRelationsOfTablesInterface[]): string;
}