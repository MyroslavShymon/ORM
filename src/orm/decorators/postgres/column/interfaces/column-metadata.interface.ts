import { ColumnOptionsInterfacePostgres } from '@decorators/postgres';

export interface ColumnMetadataInterface {
	name: string;
	propertyKey: string;
	options?: ColumnOptionsInterfacePostgres;
}