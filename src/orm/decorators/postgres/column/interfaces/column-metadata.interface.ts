import { ColumnOptionsInterfacePostgres } from './column-options-postgresql.interface';

export interface ColumnMetadataInterface {
	name: string;
	propertyKey: string;
	options?: ColumnOptionsInterfacePostgres;
}