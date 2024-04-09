import { ColumnOptionsDecoratorInterface } from './column-options-decorator.interface';

export interface ColumnMetadataInterface {
	name: string;
	propertyKey: string;
	options?: ColumnOptionsDecoratorInterface;
}