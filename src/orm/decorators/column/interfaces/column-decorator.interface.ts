import { ColumnOptionsDecoratorInterface } from './column-options-decorator.interface';

export interface ColumnDecoratorInterface {
	name?: string;
	options?: ColumnOptionsDecoratorInterface;
}