import { ColumnOptionsInterface } from './column-options.interface';

export interface ColumnMetadataInterface {
	name: string;
	propertyKey: string;
	options?: ColumnOptionsInterface;
}