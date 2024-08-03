import { IndexOptionsDecoratorInterface } from '@decorators/index/interfaces/index-options-decorator.interface';

export interface IndexDecoratorInterface {
	indexName: string;
	columns: string[];
	tableName?: string;
	options?: IndexOptionsDecoratorInterface;
}