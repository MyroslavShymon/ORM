import { Condition, LogicalOperators } from '@core/types';
import { CacheOptionsInterface } from '@context/common/interfaces/query-builder/cache-options.interface';

export interface QueryBuilderInterface<T> {
	query: string;

	createView(name: string): QueryBuilderInterface<T>;

	select(columns?: string[]): QueryBuilderInterface<T>;

	into(name: string): QueryBuilderInterface<T>;

	sum(column: string): QueryBuilderInterface<T>;

	count(column: string): QueryBuilderInterface<T>;

	having(condition: string): QueryBuilderInterface<T>;

	as(alias: string): QueryBuilderInterface<T>;

	groupBy(columns: string[]): QueryBuilderInterface<T>;

	from(table: string): QueryBuilderInterface<T>;

	where(params: {
		conditions?: Condition<T>,
		logicalOperator?: LogicalOperators,
		exists?: string
	} | string): QueryBuilderInterface<T>;

	leftJoin(table: string, condition: string): QueryBuilderInterface<T>;

	rightJoin(table: string, condition: string): QueryBuilderInterface<T>;

	innerJoin(table: string, condition: string): QueryBuilderInterface<T>;

	union(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T>;

	unionAll(queryBuilder: QueryBuilderInterface<T>): QueryBuilderInterface<T>;

	orderBy(column: string, order?: string): QueryBuilderInterface<T>;

	limit(count: number): QueryBuilderInterface<T>;

	insert(values: Partial<T>, tableName: string): QueryBuilderInterface<T>;

	insertMany(values: Partial<T>[], tableName: string): QueryBuilderInterface<T>;

	update(values: Partial<T>, tableName: string): QueryBuilderInterface<T>;

	delete(tableName: string): QueryBuilderInterface<T>;

	cache(options: CacheOptionsInterface): Promise<T>;

	build(): string;

	buildWithoutSemicolon(): string;

	execute(): any;
}