import { IndexOptionsDecoratorInterface } from '@decorators/index';

export interface IndexDecoratorInterface {
	indexName: string;
	columns: string[];
	tableName?: string;
	options?: IndexOptionsDecoratorInterface;
}